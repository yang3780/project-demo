const SubmissionController = require('./src/controllers/submissionController');

// 测试用例
const testCases = [
  {
    name: '正确的Java代码',
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        System.out.println(a + b);
        return;
    }
}`,
    sample_input: '1 1',
    sample_output: '2'
  },
  {
    name: '语法错误的Java代码',
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt()
        int b = scanner.nextInt();
        System.out.println(a + b);
        return;
    }
}`,
    sample_input: '1 1',
    sample_output: '2'
  },
  {
    name: '运行时错误的Java代码',
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        int c = a / 0; // 除零错误
        System.out.println(c);
        return;
    }
}`,
    sample_input: '1 0',
    sample_output: '2'
  },
  {
    name: '答案错误的Java代码',
    code: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        System.out.println(a - b); // 应该是a + b
        return;
    }
}`,
    sample_input: '1 1',
    sample_output: '2'
  }
];

// 测试函数
async function runTests() {
  console.log('开始测试Java判题逻辑...');
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n测试 ${i + 1}: ${testCase.name}`);
    console.log('代码:');
    console.log(testCase.code);
    console.log('输入:', testCase.sample_input);
    console.log('预期输出:', testCase.sample_output);
    
    try {
      const question = {
        id: 5,
        sample_input: testCase.sample_input,
        sample_output: testCase.sample_output
      };
      
      const startTime = Date.now();
      const result = await SubmissionController.judgeJava(testCase.code, question, startTime);
      
      console.log('判题结果:');
      console.log('状态:', result.status);
      console.log('执行时间:', result.execTime, 'ms');
      console.log('内存使用:', result.memoryUsed, 'KB');
      console.log('错误信息:', result.message);
    } catch (error) {
      console.error('测试出错:', error);
    }
  }
  
  console.log('\n测试完成!');
}

// 运行测试
runTests();
