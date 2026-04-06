const SubmissionController = require('./src/controllers/submissionController');

// 测试用例
const testCases = [
  {
    name: '正确的代码',
    code: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b;
    return 0;
}`,
    sample_input: '1 1',
    sample_output: '2'
  },
  {
    name: '语法错误的代码',
    code: `#include <iostream>
using namespace std;

int main() {
    int a, b
    cin >> a >> b;
    cout << a + b;
    return 0;
}`,
    sample_input: '1 1',
    sample_output: '2'
  },
  {
    name: '运行时错误的代码',
    code: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    int c = a / 0; // 除零错误
    cout << c;
    return 0;
}`,
    sample_input: '1 0',
    sample_output: '2'
  },
  {
    name: '超时的代码',
    code: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    while (true) {}
    cout << a + b;
    return 0;
}`,
    sample_input: '1 1',
    sample_output: '2'
  },
  {
    name: '答案错误的代码',
    code: `#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a - b; // 应该是a + b
    return 0;
}`,
    sample_input: '1 1',
    sample_output: '2'
  }
];

// 测试函数
async function runTests() {
  console.log('开始测试C++判题逻辑...');
  
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
      const result = await SubmissionController.judgeCpp(testCase.code, question, startTime);
      
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
