import{o as T,c as r,a as e,b as y,w as x,t as s,x as p,k as w,y as R,m as D,d as C,F as L,n as V,z as B,g as l,r as N,i as u,j as k}from"./index-CJDh5pBr.js";const W={class:"space-y-4"},z={class:"flex items-center space-x-4 mb-4"},q={class:"card"},I={class:"flex flex-wrap justify-between items-start gap-4"},$={class:"text-2xl font-bold mb-2"},F={class:"flex items-center space-x-4"},U={class:"text-gray-500"},H={class:"text-gray-500"},J={class:"text-gray-500"},K={class:"grid grid-cols-1 lg:grid-cols-5 gap-6"},P={class:"lg:col-span-2"},Q={class:"card h-full"},G={class:"flex border-b mb-4"},O={key:0,class:"space-y-4"},X={class:"text-gray-700 whitespace-pre-wrap"},Y={class:"text-gray-700 whitespace-pre-wrap"},Z={class:"text-gray-700 whitespace-pre-wrap"},ee={class:"bg-gray-100 p-3 rounded-md text-gray-700 whitespace-pre-wrap"},te={class:"bg-gray-100 p-3 rounded-md text-gray-700 whitespace-pre-wrap"},se={key:1},ne={class:"lg:col-span-3"},ae={class:"card h-full"},oe={class:"flex justify-between items-center mb-4"},ie={class:"flex items-center space-x-4"},re={class:"border rounded-md mb-4"},le={class:"bg-gray-100 px-4 py-2 border-b flex justify-between items-center"},ue={class:"text-gray-600"},de={class:"p-4"},ce={class:"flex items-center justify-between"},me={class:"font-semibold"},pe={class:"text-gray-600"},ve={class:"mt-2 text-sm"},_e={class:"mt-6"},fe={class:"flex justify-between items-center mb-2"},ge={key:0,class:"space-y-2"},he={class:"flex items-center space-x-4"},be={class:"text-sm"},ye={class:"text-sm"},xe={class:"font-medium"},Ee={__name:"QuestionDetailView",setup(we){B().params.id;const n=l({id:1,title:"两数之和",description:`给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。`,input_format:`第一行输入数组长度 n
第二行输入 n 个整数，用空格分隔
第三行输入 target`,output_format:"输出两个下标，用空格分隔",sample_input:`4
2 7 11 15
9`,sample_output:"0 1",difficulty:1,score:10,type:"数组",time_limit:1e3,memory_limit:256}),d=l("description"),c=l("python"),m=l(""),o=l(null),v=l(!1),_=l([{id:1,language:"python",status:"AC",exec_time:45,memory_used:10240,submitted_at:"2026-03-20 10:00:00"},{id:2,language:"python",status:"WA",exec_time:32,memory_used:9876,submitted_at:"2026-03-20 09:30:00"}]);T(()=>{f()});const f=()=>{switch(c.value){case"python":m.value=`n = int(input())
nums = list(map(int, input().split()))
target = int(input())

def twoSum(nums, target):
    hashmap = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[num] = i
    return []

print(' '.join(map(str, twoSum(nums, target))))`;break;case"cpp":m.value=`#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> hashmap;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (hashmap.find(complement) != hashmap.end()) {
            return {hashmap[complement], i};
        }
        hashmap[nums[i]] = i;
    }
    return {};
}

int main() {
    int n, target;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    cin >> target;
    vector<int> result = twoSum(nums, target);
    cout << result[0] << " " << result[1] << endl;
    return 0;
}`;break;case"javascript":m.value=`const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let n, nums, target;
let count = 0;

rl.on('line', (line) => {
    if (count === 0) {
        n = parseInt(line);
    } else if (count === 1) {
        nums = line.split(' ').map(Number);
    } else if (count === 2) {
        target = parseInt(line);
        console.log(twoSum(nums, target).join(' '));
        rl.close();
    }
    count++;
});

function twoSum(nums, target) {
    const hashmap = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (hashmap.has(complement)) {
            return [hashmap.get(complement), i];
        }
        hashmap.set(nums[i], i);
    }
    return [];
}`;break}},E=()=>{o.value={status:Math.random()>.3?"AC":["WA","TLE","RE","CE"][Math.floor(Math.random()*4)],exec_time:Math.floor(Math.random()*100),memory_used:Math.floor(Math.random()*20480),message:""},_.value.unshift({id:_.value.length+1,language:c.value,status:o.value.status,exec_time:o.value.exec_time,memory_used:o.value.memory_used,submitted_at:new Date().toLocaleString()})},M=()=>{f()},j=()=>{alert("代码格式化功能正在开发中...")},A=i=>{switch(i){case 1:return"difficulty-easy";case 2:return"difficulty-medium";case 3:return"difficulty-hard";default:return""}},S=i=>{switch(i){case 1:return"简单";case 2:return"中等";case 3:return"困难";default:return""}},g=i=>{switch(i){case"AC":return"bg-green-50 border-green-200 text-green-800";case"WA":return"bg-red-50 border-red-200 text-red-800";case"TLE":return"bg-yellow-50 border-yellow-200 text-yellow-800";case"RE":return"bg-purple-50 border-purple-200 text-purple-800";case"CE":return"bg-blue-50 border-blue-200 text-blue-800";default:return""}},h=i=>{switch(i){case"AC":return"Accepted";case"WA":return"Wrong Answer";case"TLE":return"Time Limit Exceeded";case"RE":return"Runtime Error";case"CE":return"Compilation Error";default:return i}};return(i,t)=>{const b=N("router-link");return u(),r("div",W,[e("div",z,[y(b,{to:"/questions",class:"btn btn-outline"},{default:x(()=>[...t[5]||(t[5]=[k("返回题库",-1)])]),_:1}),y(b,{to:"/algorithm",class:"btn btn-outline"},{default:x(()=>[...t[6]||(t[6]=[k("查看演示",-1)])]),_:1})]),e("div",q,[e("div",I,[e("div",null,[e("h1",$,s(n.value.title),1),e("div",F,[e("span",{class:p(A(n.value.difficulty))},s(S(n.value.difficulty)),3),e("span",U,"积分: "+s(n.value.score),1),e("span",H,s(n.value.time_limit)+"ms / "+s(n.value.memory_limit)+"MB",1)])]),e("div",null,[e("span",J,"类型: "+s(n.value.type),1)])])]),e("div",K,[e("div",P,[e("div",Q,[e("div",G,[e("button",{class:p(["px-4 py-2 border-b-2",d.value==="description"?"border-primary text-primary":"border-transparent"]),onClick:t[0]||(t[0]=a=>d.value="description")}," 题目描述 ",2),e("button",{class:p(["px-4 py-2 border-b-2",d.value==="solution"?"border-primary text-primary":"border-transparent"]),onClick:t[1]||(t[1]=a=>d.value="solution")}," 题解 ",2)]),d.value==="description"?(u(),r("div",O,[e("div",null,[t[7]||(t[7]=e("h3",{class:"font-semibold mb-2"},"题目描述",-1)),e("div",X,s(n.value.description),1)]),e("div",null,[t[8]||(t[8]=e("h3",{class:"font-semibold mb-2"},"输入格式",-1)),e("div",Y,s(n.value.input_format),1)]),e("div",null,[t[9]||(t[9]=e("h3",{class:"font-semibold mb-2"},"输出格式",-1)),e("div",Z,s(n.value.output_format),1)]),e("div",null,[t[10]||(t[10]=e("h3",{class:"font-semibold mb-2"},"样例输入",-1)),e("div",ee,s(n.value.sample_input),1)]),e("div",null,[t[11]||(t[11]=e("h3",{class:"font-semibold mb-2"},"样例输出",-1)),e("div",te,s(n.value.sample_output),1)])])):(u(),r("div",se,[...t[12]||(t[12]=[e("div",{class:"text-gray-700"},[e("p",null,"题解内容正在准备中...")],-1)])]))])]),e("div",ne,[e("div",ae,[e("div",oe,[e("div",ie,[t[14]||(t[14]=e("label",{class:"text-gray-600"},"语言:",-1)),w(e("select",{"onUpdate:modelValue":t[2]||(t[2]=a=>c.value=a),class:"input"},[...t[13]||(t[13]=[e("option",{value:"python"},"Python",-1),e("option",{value:"cpp"},"C++",-1),e("option",{value:"javascript"},"JavaScript",-1)])],512),[[R,c.value]])]),e("button",{class:"btn btn-primary",onClick:E},"提交代码")]),e("div",re,[e("div",le,[e("span",ue,s(c.value),1),e("div",{class:"flex space-x-2"},[e("button",{class:"text-gray-500 hover:text-gray-700",onClick:M},"重置"),e("button",{class:"text-gray-500 hover:text-gray-700",onClick:j},"格式化")])]),e("div",de,[w(e("textarea",{"onUpdate:modelValue":t[3]||(t[3]=a=>m.value=a),class:"w-full h-64 font-mono text-sm bg-white border-0 outline-none resize-none",placeholder:"请输入代码..."},null,512),[[D,m.value]])])]),o.value?(u(),r("div",{key:0,class:p(["mb-4 p-4 rounded-md",g(o.value.status)])},[e("div",ce,[e("h3",me,s(h(o.value.status)),1),e("span",pe,s(o.value.exec_time)+"ms / "+s(o.value.memory_used)+"KB",1)]),e("p",ve,s(o.value.message||""),1)],2)):C("",!0),e("div",_e,[e("div",fe,[t[15]||(t[15]=e("h3",{class:"font-semibold"},"历史提交",-1)),e("button",{class:"text-sm text-primary hover:underline",onClick:t[4]||(t[4]=a=>v.value=!v.value)},s(v.value?"收起":"展开"),1)]),v.value?(u(),r("div",ge,[(u(!0),r(L,null,V(_.value,a=>(u(),r("div",{key:a.id,class:p(["p-2 border rounded-md flex justify-between items-center",g(a.status)])},[e("div",he,[e("span",be,s(a.language),1),e("span",ye,s(a.submitted_at),1)]),e("span",xe,s(h(a.status)),1)],2))),128))])):C("",!0)])])])])])}}};export{Ee as default};
