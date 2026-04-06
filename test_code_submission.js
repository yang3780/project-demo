const axios = require('axios');

// 测试代码提交和判题功能
async function testCodeSubmission() {
  try {
    console.log('开始测试代码提交和判题功能...');
    
    // 1. 测试Python代码提交
    console.log('\n测试Python代码提交:');
    const pythonCode = `a, b = map(int, input().split())
print(a + b)`;
    
    const pythonResponse = await axios.post('http://localhost:3000/api/submissions', {
      question_id: 5,
      code: pythonCode,
      language: 'python'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your_token_here' // 替换为实际的token
      }
    });
    
    console.log('Python代码提交结果:', pythonResponse.data);
    
    // 2. 测试C++代码提交
    console.log('\n测试C++代码提交:');
    const cppCode = `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b;
    return 0;
}`;
    
    const cppResponse = await axios.post('http://localhost:3000/api/submissions', {
      question_id: 5,
      code: cppCode,
      language: 'cpp'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your_token_here' // 替换为实际的token
      }
    });
    
    console.log('C++代码提交结果:', cppResponse.data);
    
    // 3. 测试Java代码提交
    console.log('\n测试Java代码提交:');
    const javaCode = `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int a = scanner.nextInt();
        int b = scanner.nextInt();
        System.out.println(a + b);
        return;
    }
}`;
    
    const javaResponse = await axios.post('http://localhost:3000/api/submissions', {
      question_id: 5,
      code: javaCode,
      language: 'java'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your_token_here' // 替换为实际的token
      }
    });
    
    console.log('Java代码提交结果:', javaResponse.data);
    
    console.log('\n测试完成!');
  } catch (error) {
    console.error('测试出错:', error.message);
  }
}

// 运行测试
testCodeSubmission();
