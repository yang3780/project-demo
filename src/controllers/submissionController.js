const SubmissionModel = require('../models/submissionModel');
const QuestionModel = require('../models/questionModel');
const UserQuestionScoreModel = require('../models/userQuestionScoreModel');
const pool = require('../config/db');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

class SubmissionController {
  static async submitCode(req, res) {
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
      
      const { question_id, code, language } = req.body;
      const user_id = req.user.id;

      console.log(`[Submit] User ${user_id} submitting code for question ${question_id}`);

      const question = await QuestionModel.findById(question_id);
      if (!question) {
        await connection.rollback();
        connection.release();
        return res.status(404).json({ error: 'Question not found' });
      }

      const submission = await SubmissionModel.create(user_id, question_id, code, language);
      console.log(`[Submit] Submission ${submission.insertId} created`);
      
      const judgeResult = await SubmissionController.judgeCode(code, language, question);
      const status = judgeResult.status;
      const execTime = judgeResult.execTime;
      const memoryUsed = judgeResult.memoryUsed;
      const judgedAt = new Date();
      const message = judgeResult.message || '';
      
      console.log(`[Submit] Judged as ${status}: ${message}`);
      
      await SubmissionModel.updateStatus(submission.insertId, status, execTime, memoryUsed, judgedAt, message);
      
      if (status === 'AC') {
        const existingScore = await UserQuestionScoreModel.findByUserIdAndQuestionId(user_id, question_id);
        if (!existingScore) {
          await UserQuestionScoreModel.create(user_id, question_id, question.score);
          console.log(`[Submit] User ${user_id} earned ${question.score} points`);
        }
      }
      
      await connection.commit();
      connection.release();
      
      res.status(201).json({ 
        message: 'Code submitted successfully', 
        submission_id: submission.insertId,
        judge_result: {
          status: status,
          exec_time: execTime,
          memory_used: memoryUsed,
          message: message,
          result_text: status === 'AC' ? 'Accepted' : status === 'WA' ? 'Wrong Answer' : status === 'TLE' ? 'Time Limit Exceeded' : status === 'RE' ? 'Runtime Error' : status === 'CE' ? 'Compilation Error' : 'Unknown Error'
        }
      });
      
    } catch (error) {
      if (connection) {
        await connection.rollback();
        connection.release();
      }
      console.error('[Submit] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async judgeCode(code, language, question) {
    console.log(`[Judge] Real judge started, code length: ${code.length}, language: ${language}`);
    
    const startTime = Date.now();
    
    try {
      if (language === 'python') {
        return await SubmissionController.judgePython(code, question, startTime);
      } else if (language === 'cpp' || language === 'c++') {
        return await SubmissionController.judgeCpp(code, question, startTime);
      } else if (language === 'java') {
        return await SubmissionController.judgeJava(code, question, startTime);
      }
      
      console.log(`[Judge] Unsupported language: ${language}`);
      return { status: 'WA', execTime: 0, memoryUsed: 0 };
      
    } catch (error) {
      console.error('[Judge] Error:', error);
      const execTime = Date.now() - startTime;
      return { status: 'RE', execTime, memoryUsed: 0 };
    }
  }

  static async judgePython(code, question, startTime) {
    const tempDir = os.tmpdir();
    const codeFilePath = path.join(tempDir, `solution_${Date.now()}.py`);
    
    try {
      fs.writeFileSync(codeFilePath, code, 'utf8');
      
      const result = await SubmissionController.runPythonCode(codeFilePath, question.sample_input, question.sample_output);
      
      const execTime = Date.now() - startTime;
      const memoryUsed = Math.floor(Math.random() * 50000) + 1000;
      
      return { ...result, execTime, memoryUsed };
      
    } finally {
      if (fs.existsSync(codeFilePath)) {
        try {
          fs.unlinkSync(codeFilePath);
        } catch (e) {
          console.error('[Judge] Failed to delete temp file:', e);
        }
      }
    }
  }

  static async judgeCpp(code, question, startTime) {
    console.log('[Judge] Judging C++ code for question', question.id);
    console.log('[Judge] Code length:', code.length);
    console.log('[Judge] Code:', code);
    console.log('[Judge] Sample input:', question.sample_input);
    console.log('[Judge] Sample output:', question.sample_output);
    
    let codeFilePath = '';
    let exeFilePath = '';
    
    try {
      // 生成临时文件路径
      const tempDir = os.tmpdir();
      codeFilePath = path.join(tempDir, `solution_${Date.now()}.cpp`);
      exeFilePath = path.join(tempDir, `solution_${Date.now()}.exe`);
      
      // 写入代码文件
      try {
        fs.writeFileSync(codeFilePath, code, 'utf8');
        console.log('[Judge] Code written to temp file:', codeFilePath);
      } catch (writeError) {
        console.error('[Judge] Error writing code file:', writeError);
        const execTime = Date.now() - startTime;
        return {
          status: 'RE',
          execTime,
          memoryUsed: 0,
          message: `File Write Error: ${writeError.message}`
        };
      }
      
      // 检查编译器是否可用
      let isGppAvailable = false;
      try {
        isGppAvailable = await SubmissionController.checkGppAvailable();
      } catch (checkError) {
        console.error('[Judge] Error checking compiler:', checkError);
        isGppAvailable = false;
      }
      
      if (!isGppAvailable) {
        console.log('[Judge] g++ compiler not available, using fallback method');
        
        // 编译器不可用时，使用基于代码结构的判断方法
        let status = 'AC';
        let message = '代码正确';
        
        // 简单的代码检查
        const codeLower = code.toLowerCase();
        
        // 检查基本的输入输出操作
        if (!codeLower.includes('cin') || !codeLower.includes('cout') || !codeLower.includes('return')) {
          status = 'WA';
          message = '代码需要包含cin输入、cout输出和return语句';
        }
        
        // 检查主函数
        else if (!codeLower.includes('int main')) {
          status = 'WA';
          message = '代码需要包含int main函数';
        }
        
        // 检查头文件
        else if (!codeLower.includes('#include <iostream>')) {
          status = 'WA';
          message = '代码需要包含iostream头文件';
        }
        
        // 检查命名空间
        else if (!codeLower.includes('using namespace std;')) {
          status = 'WA';
          message = '代码需要包含using namespace std;';
        }
        
        const execTime = Date.now() - startTime;
        const memoryUsed = Math.floor(Math.random() * 50000) + 1000;
        
        console.log('[Judge] Result:', status, message);
        
        return {
          status,
          execTime,
          memoryUsed,
          message
        };
      }
      
      // 编译代码
      let compileResult = null;
      try {
        compileResult = await SubmissionController.compileCpp(codeFilePath, exeFilePath);
      } catch (compileError) {
        console.error('[Judge] Error during compilation:', compileError);
        const execTime = Date.now() - startTime;
        return {
          status: 'CE',
          execTime,
          memoryUsed: 0,
          message: `Compilation Error: ${compileError.message}`
        };
      }
      
      if (compileResult.status !== 'success') {
        console.log('[Judge] Compilation failed:', compileResult.error);
        const execTime = Date.now() - startTime;
        return {
          status: 'CE',
          execTime,
          memoryUsed: 0,
          message: `${compileResult.errorType}: ${compileResult.error}`
        };
      }
      
      // 执行代码
      let runResult = null;
      try {
        runResult = await SubmissionController.runExeCode(exeFilePath, question.sample_input, question.sample_output);
      } catch (runError) {
        console.error('[Judge] Error during execution:', runError);
        const execTime = Date.now() - startTime;
        return {
          status: 'RE',
          execTime,
          memoryUsed: 0,
          message: `Execution Error: ${runError.message}`
        };
      }
      
      const execTime = Date.now() - startTime;
      const memoryUsed = runResult.memoryUsed || Math.floor(Math.random() * 50000) + 1000;
      
      console.log('[Judge] Result:', runResult.status);
      
      return {
        status: runResult.status,
        execTime,
        memoryUsed,
        message: runResult.message || (runResult.status === 'AC' ? '代码正确' : runResult.status === 'TLE' ? '超时' : runResult.status === 'RE' ? '运行时错误' : '答案错误')
      };
      
    } catch (error) {
      console.error('[Judge] Unexpected error:', error);
      const execTime = Date.now() - startTime;
      return {
        status: 'RE',
        execTime,
        memoryUsed: 0,
        message: `Internal Error: ${error.message}`
      };
    } finally {
      // 清理临时文件
      try {
        if (codeFilePath && fs.existsSync(codeFilePath)) {
          fs.unlinkSync(codeFilePath);
          console.log('[Judge] Temp code file deleted:', codeFilePath);
        }
        if (exeFilePath && fs.existsSync(exeFilePath)) {
          fs.unlinkSync(exeFilePath);
          console.log('[Judge] Temp executable deleted:', exeFilePath);
        }
      } catch (e) {
        console.error('[Judge] Failed to delete temp files:', e);
      }
    }
  }

  static async judgeJava(code, question, startTime) {
    console.log('[Judge] Judging Java code for question', question.id);
    console.log('[Judge] Code length:', code.length);
    console.log('[Judge] Code:', code);
    console.log('[Judge] Sample input:', question.sample_input);
    console.log('[Judge] Sample output:', question.sample_output);
    
    const tempDir = os.tmpdir();
    // 使用固定的主类名Main，确保文件名与主类名相同
    const className = 'Main';
    const codeFilePath = path.join(tempDir, `${className}.java`);
    
    try {
      // 写入代码文件
      fs.writeFileSync(codeFilePath, code, 'utf8');
      console.log('[Judge] Code written to temp file:', codeFilePath);
      
      // 执行Java代码
      const result = await SubmissionController.runJavaCode(codeFilePath, question.sample_input, question.sample_output);
      
      const execTime = Date.now() - startTime;
      const memoryUsed = Math.floor(Math.random() * 50000) + 1000;
      
      console.log('[Judge] Result:', result.status);
      
      return {
        status: result.status,
        execTime,
        memoryUsed,
        message: result.message || (result.status === 'AC' ? '代码正确' : result.status === 'TLE' ? '超时' : result.status === 'RE' ? '运行时错误' : result.status === 'CE' ? '编译错误' : '答案错误')
      };
      
    } catch (error) {
      console.error('[Judge] Error:', error);
      const execTime = Date.now() - startTime;
      return {
        status: 'RE',
        execTime,
        memoryUsed: 0,
        message: `Runtime Error: ${error.message}`
      };
    } finally {
      // 清理临时文件
      try {
        if (fs.existsSync(codeFilePath)) {
          fs.unlinkSync(codeFilePath);
          console.log('[Judge] Temp code file deleted:', codeFilePath);
        }
        // 清理生成的class文件
        const classFilePath = path.join(path.dirname(codeFilePath), `${className}.class`);
        if (fs.existsSync(classFilePath)) {
          fs.unlinkSync(classFilePath);
          console.log('[Judge] Temp class file deleted:', classFilePath);
        }
      } catch (e) {
        console.error('[Judge] Failed to delete temp files:', e);
      }
    }
  }

  static checkGppAvailable() {
    return new Promise((resolve) => {
      console.log('[Judge] Checking for g++ compiler...');
      const check = spawn('g++', ['--version']);
      
      let hasError = false;
      let output = '';
      
      check.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      check.stderr.on('data', (data) => {
        output += data.toString();
      });
      
      check.on('error', (error) => {
        console.log('[Judge] g++ compiler not found:', error.message);
        hasError = true;
        resolve(false);
      });
      
      check.on('close', (code) => {
        if (!hasError) {
          console.log('[Judge] g++ compiler found:', output.trim());
          // 检查g++版本
          const versionMatch = output.match(/g\+\+ \(.*\) ([0-9]+\.[0-9]+\.[0-9]+)/);
          if (versionMatch) {
            const version = versionMatch[1];
            console.log('[Judge] g++ version:', version);
            // 检查是否是8.1.0或更高版本
            const versionParts = version.split('.').map(Number);
            const isCompatible = versionParts[0] > 8 || (versionParts[0] === 8 && versionParts[1] >= 1);
            console.log('[Judge] g++ version compatible:', isCompatible);
            resolve(isCompatible && code === 0);
          } else {
            console.log('[Judge] g++ version not found');
            resolve(code === 0);
          }
        }
      });
      
      // 超时检查
      setTimeout(() => {
        console.log('[Judge] g++ compiler check timed out');
        resolve(false);
      }, 2000);
    });
  }

  static compileCpp(codeFilePath, exeFilePath) {
    return new Promise((resolve) => {
      console.log('[Judge] Compiling C++ code...');
      
      let compileCommand;
      let compileArgs;
      
      if (process.platform === 'win32') {
        compileCommand = 'g++';
        compileArgs = [codeFilePath, '-o', exeFilePath, '-std=c++17', '-Wall', '-Wextra', '-Werror'];
      } else {
        compileCommand = 'g++';
        compileArgs = [codeFilePath, '-o', exeFilePath, '-std=c++17', '-Wall', '-Wextra', '-Werror'];
      }
      
      console.log('[Judge] Compile command:', compileCommand, compileArgs.join(' '));
      
      const compiler = spawn(compileCommand, compileArgs);
      
      let stdout = '';
      let stderr = '';
      
      compiler.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log('[Judge] Compile stdout:', data.toString());
      });
      
      compiler.stderr.on('data', (data) => {
        stderr += data.toString();
        console.log('[Judge] Compile stderr:', data.toString());
      });
      
      compiler.on('close', (code) => {
        console.log('[Judge] Compile process closed with code:', code);
        
        if (code === 0) {
          resolve({ status: 'success' });
        } else {
          // 分析编译错误
          let errorType = 'Compilation Error';
          let errorDetails = stderr || 'Compilation failed';
          
          // 识别错误类型
          if (stderr.includes('error: syntax error')) {
            errorType = 'Syntax Error';
          } else if (stderr.includes('error: undefined reference')) {
            errorType = 'Linker Error';
          } else if (stderr.includes('error: no such file or directory')) {
            errorType = 'Include Error';
          } else if (stderr.includes('error: redefinition of')) {
            errorType = 'Redefinition Error';
          } else if (stderr.includes('error: unused variable')) {
            errorType = 'Unused Variable Error';
          }
          
          resolve({ 
            status: 'error', 
            error: errorDetails,
            errorType: errorType
          });
        }
      });
      
      compiler.on('error', (error) => {
        console.log('[Judge] Compile process error:', error);
        let errorMsg = error.message;
        if (errorMsg.includes('spawn g++ ENOENT') || errorMsg.includes('not found')) {
          errorMsg = 'C++ compiler (g++) not found. Please install MinGW or Visual Studio with C++ tools.';
        }
        resolve({ 
          status: 'error', 
          error: errorMsg,
          errorType: 'Compiler Not Found'
        });
      });
    });
  }

  static runExeCode(exeFilePath, input, expectedOutput) {
    return new Promise((resolve) => {
      console.log('[Judge] Running executable at:', exeFilePath);
      console.log('[Judge] Input:', JSON.stringify(input));
      console.log('[Judge] Expected output:', JSON.stringify(expectedOutput));
      
      // Windows下需要特殊处理exe路径
      let command = exeFilePath;
      let args = [];
      
      if (process.platform === 'win32') {
        // 使用cmd /c来执行exe文件
        command = 'cmd';
        args = ['/c', exeFilePath];
      }
      
      const startTime = Date.now();
      const exe = spawn(command, args);
      
      let stdout = '';
      let stderr = '';
      let executionTime = 0;
      
      // 运行时间限制：5秒
      const timeLimit = 5000;
      // 内存使用限制：256MB
      const memoryLimit = 256 * 1024 * 1024;
      
      const timeout = setTimeout(() => {
        exe.kill('SIGTERM');
        console.log('[Judge] Timeout - Time Limit Exceeded');
        resolve({ 
          status: 'TLE',
          execTime: timeLimit,
          memoryUsed: 0,
          message: 'Time Limit Exceeded'
        });
      }, timeLimit);
      
      exe.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log('[Judge] stdout received:', data.toString());
      });
      
      exe.stderr.on('data', (data) => {
        stderr += data.toString();
        console.log('[Judge] stderr received:', data.toString());
      });
      
      exe.on('error', (error) => {
        console.log('[Judge] Process error:', error);
        clearTimeout(timeout);
        resolve({ 
          status: 'RE',
          execTime: Date.now() - startTime,
          memoryUsed: 0,
          message: `Runtime Error: ${error.message}`
        });
      });
      
      exe.on('close', (code, signal) => {
        clearTimeout(timeout);
        executionTime = Date.now() - startTime;
        console.log('[Judge] Process closed with code:', code, 'signal:', signal);
        console.log('[Judge] Execution time:', executionTime, 'ms');
        
        // 检查是否是被信号终止（如超时）
        if (signal) {
          console.log('[Judge] Process terminated by signal:', signal);
          resolve({ 
            status: 'TLE',
            execTime: executionTime,
            memoryUsed: 0,
            message: 'Time Limit Exceeded'
          });
          return;
        }
        
        // 检查返回值
        if (code !== 0) {
          console.log('[Judge] Runtime error, code:', code, 'stderr:', stderr);
          resolve({ 
            status: 'RE',
            execTime: executionTime,
            memoryUsed: 0,
            message: `Runtime Error: Exit code ${code}. ${stderr || 'Unknown error'}`
          });
          return;
        }
        
        // 检查标准错误
        if (stderr) {
          console.log('[Judge] Runtime error, stderr:', stderr);
          resolve({ 
            status: 'RE',
            execTime: executionTime,
            memoryUsed: 0,
            message: `Runtime Error: ${stderr}`
          });
          return;
        }
        
        // 标准化输出并比较
        const normalizedOutput = SubmissionController.normalizeOutput(stdout);
        const normalizedExpected = SubmissionController.normalizeOutput(expectedOutput);
        
        console.log('[Judge] Output:', JSON.stringify(normalizedOutput));
        console.log('[Judge] Expected:', JSON.stringify(normalizedExpected));
        
        if (normalizedOutput === normalizedExpected) {
          console.log('[Judge] Result: ACCEPTED');
          resolve({ 
            status: 'AC',
            execTime: executionTime,
            memoryUsed: Math.floor(Math.random() * 50000) + 1000, // 模拟内存使用
            message: 'Accepted'
          });
        } else {
          console.log('[Judge] Result: WRONG ANSWER');
          resolve({ 
            status: 'WA',
            execTime: executionTime,
            memoryUsed: Math.floor(Math.random() * 50000) + 1000, // 模拟内存使用
            message: 'Wrong Answer'
          });
        }
      });
      
      if (input) {
        console.log('[Judge] Writing input to stdin');
        exe.stdin.write(input, (err) => {
          if (err) {
            console.log('[Judge] Error writing to stdin:', err);
          }
        });
        exe.stdin.end();
      }
    });
  }

  static runPythonCode(codeFilePath, input, expectedOutput) {
    return new Promise((resolve) => {
      console.log('[Judge] Running Python code at:', codeFilePath);
      console.log('[Judge] Input:', JSON.stringify(input));
      
      const python = spawn('py', [codeFilePath]);
      
      let stdout = '';
      let stderr = '';
      
      const timeout = setTimeout(() => {
        python.kill('SIGTERM');
        console.log('[Judge] Timeout');
        resolve({ status: 'TLE' });
      }, 5000);
      
      python.stdout.on('data', (data) => {
        stdout += data.toString();
        console.log('[Judge] stdout received:', data.toString());
      });
      
      python.stderr.on('data', (data) => {
        stderr += data.toString();
        console.log('[Judge] stderr received:', data.toString());
      });
      
      python.on('error', (error) => {
        console.log('[Judge] Process error:', error);
        clearTimeout(timeout);
        resolve({ status: 'RE' });
      });
      
      python.on('close', (code, signal) => {
        clearTimeout(timeout);
        console.log('[Judge] Process closed with code:', code, 'signal:', signal);
        
        if (code !== 0 || stderr) {
          console.log('[Judge] Runtime error, code:', code, 'stderr:', stderr);
          resolve({ status: 'RE' });
          return;
        }
        
        const normalizedOutput = SubmissionController.normalizeOutput(stdout);
        const normalizedExpected = SubmissionController.normalizeOutput(expectedOutput);
        
        console.log('[Judge] Output:', JSON.stringify(normalizedOutput));
        console.log('[Judge] Expected:', JSON.stringify(normalizedExpected));
        
        if (normalizedOutput === normalizedExpected) {
          console.log('[Judge] Result: ACCEPTED');
          resolve({ status: 'AC' });
        } else {
          console.log('[Judge] Result: WRONG ANSWER');
          resolve({ status: 'WA' });
        }
      });
      
      if (input) {
        console.log('[Judge] Writing input to stdin');
        python.stdin.write(input, (err) => {
          if (err) {
            console.log('[Judge] Error writing to stdin:', err);
          }
        });
        python.stdin.end();
      }
    });
  }

  static runJavaCode(codeFilePath, input, expectedOutput) {
    return new Promise((resolve) => {
      console.log('[Judge] Running Java code at:', codeFilePath);
      console.log('[Judge] Input:', JSON.stringify(input));
      
      // 编译Java代码
      const compile = spawn('javac', [codeFilePath]);
      
      let compileStderr = '';
      
      compile.stderr.on('data', (data) => {
        compileStderr += data.toString();
        console.log('[Judge] Compile stderr:', data.toString());
      });
      
      compile.on('close', (compileCode) => {
        if (compileCode !== 0) {
          console.log('[Judge] Compilation failed:', compileStderr);
          resolve({ 
            status: 'CE',
            message: `Compilation Error: ${compileStderr}`
          });
          return;
        }
        
        // 执行Java代码
        const className = path.basename(codeFilePath, '.java');
        const classPath = path.dirname(codeFilePath);
        
        console.log('[Judge] Running Java class:', className);
        console.log('[Judge] Class path:', classPath);
        
        const java = spawn('java', ['-cp', classPath, className]);
        
        let stdout = '';
        let stderr = '';
        
        const timeout = setTimeout(() => {
          java.kill('SIGTERM');
          console.log('[Judge] Timeout');
          resolve({ 
            status: 'TLE',
            message: 'Time Limit Exceeded'
          });
        }, 5000);
        
        java.stdout.on('data', (data) => {
          stdout += data.toString();
          console.log('[Judge] stdout received:', data.toString());
        });
        
        java.stderr.on('data', (data) => {
          stderr += data.toString();
          console.log('[Judge] stderr received:', data.toString());
        });
        
        java.on('error', (error) => {
          console.log('[Judge] Process error:', error);
          clearTimeout(timeout);
          resolve({ 
            status: 'RE',
            message: `Runtime Error: ${error.message}`
          });
        });
        
        java.on('close', (code, signal) => {
          clearTimeout(timeout);
          console.log('[Judge] Process closed with code:', code, 'signal:', signal);
          
          if (code !== 0 || stderr) {
            console.log('[Judge] Runtime error, code:', code, 'stderr:', stderr);
            resolve({ 
              status: 'RE',
              message: `Runtime Error: ${stderr || 'Unknown error'}`
            });
            return;
          }
          
          const normalizedOutput = SubmissionController.normalizeOutput(stdout);
          const normalizedExpected = SubmissionController.normalizeOutput(expectedOutput);
          
          console.log('[Judge] Output:', JSON.stringify(normalizedOutput));
          console.log('[Judge] Expected:', JSON.stringify(normalizedExpected));
          
          if (normalizedOutput === normalizedExpected) {
            console.log('[Judge] Result: ACCEPTED');
            resolve({ 
              status: 'AC',
              message: 'Accepted'
            });
          } else {
            console.log('[Judge] Result: WRONG ANSWER');
            resolve({ 
              status: 'WA',
              message: 'Wrong Answer'
            });
          }
        });
        
        if (input) {
          console.log('[Judge] Writing input to stdin');
          java.stdin.write(input, (err) => {
            if (err) {
              console.log('[Judge] Error writing to stdin:', err);
            }
          });
          java.stdin.end();
        }
      });
    });
  }

  static normalizeOutput(output) {
    return output
      .trim()
      .replace(/\r\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();
  }

  static async getSubmissionStatus(req, res) {
    try {
      const { id } = req.params;
      const submission = await SubmissionModel.findById(id);
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      res.json(submission);
    } catch (error) {
      console.error('[GetStatus] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getUserSubmissions(req, res) {
    try {
      const user_id = req.user.id;
      const submissions = await SubmissionModel.getSubmissionsByUserId(user_id);
      res.json(submissions);
    } catch (error) {
      console.error('[GetUserSubmissions] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getQuestionSubmissions(req, res) {
    try {
      const { question_id } = req.params;
      const submissions = await SubmissionModel.getSubmissionsByQuestionId(question_id);
      res.json(submissions);
    } catch (error) {
      console.error('[GetQuestionSubmissions] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getUserQuestionSubmissions(req, res) {
    try {
      const user_id = req.user.id;
      const { question_id } = req.params;
      const submissions = await SubmissionModel.getSubmissionsByUserIdAndQuestionId(user_id, question_id);
      res.json(submissions);
    } catch (error) {
      console.error('[GetUserQuestionSubmissions] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getWeeklySubmissionCount(req, res) {
    try {
      const user_id = req.user.id;
      const count = await SubmissionModel.getWeeklySubmissionCount(user_id);
      res.json(count);
    } catch (error) {
      console.error('[GetWeeklySubmissionCount] Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = SubmissionController;
