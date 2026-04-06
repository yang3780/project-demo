<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">算法可视化</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-3">
        <div class="card h-full">
          <h3 class="text-lg font-semibold mb-4">算法选择</h3>
          
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 mb-2">算法分类</h4>
            <div class="space-y-2">
              <button 
                v-for="category in categories" 
                :key="category.id"
                class="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                :class="activeCategory === category.id ? 'bg-blue-50 text-primary' : ''"
                @click="activeCategory = category.id"
              >
                {{ category.name }}
              </button>
            </div>
          </div>
          
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 mb-2">算法列表</h4>
            <div class="space-y-2">
              <button 
                v-for="algorithm in filteredAlgorithms" 
                :key="algorithm.id"
                class="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                :class="activeAlgorithm === algorithm.id ? 'bg-blue-50 text-primary' : ''"
                @click="selectAlgorithm(algorithm)"
              >
                {{ algorithm.name }}
              </button>
            </div>
          </div>
          
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-700 mb-2">参数设置</h4>
            <div class="space-y-4">
              <div v-if="currentAlgorithm?.type !== 'graph' && currentAlgorithm?.type !== 'dp'">
                <label class="block text-sm text-gray-600 mb-1">数组大小: {{ params.arraySize }}</label>
                <input 
                  type="range" 
                  min="5" 
                  max="15" 
                  v-model="params.arraySize" 
                  class="w-full"
                />
              </div>
              <div v-if="currentAlgorithm?.id === 'fibonacci'">
                <label class="block text-sm text-gray-600 mb-1">斐波那契数: n = {{ fibonacciNumber }}</label>
                <input 
                  type="range" 
                  min="5" 
                  max="20" 
                  v-model="fibonacciNumber" 
                  class="w-full"
                />
              </div>
              <div v-if="currentAlgorithm?.id === 'lcs'">
                <label class="block text-sm text-gray-600 mb-1">字符串 1</label>
                <input 
                  type="text" 
                  v-model="lcsString1" 
                  class="w-full border rounded px-3 py-2"
                />
                <label class="block text-sm text-gray-600 mb-1 mt-2">字符串 2</label>
                <input 
                  type="text" 
                  v-model="lcsString2" 
                  class="w-full border rounded px-3 py-2"
                />
              </div>
              <div v-if="currentAlgorithm?.id === '01-knapsack-bb'">
                <label class="block text-sm text-gray-600 mb-1">背包容量: {{ bbKnapsackCapacity }}</label>
                <input 
                  type="range" 
                  min="5" 
                  max="20" 
                  v-model="bbKnapsackCapacity" 
                  class="w-full"
                />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">速度: {{ params.speed }}</label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  v-model="params.speed" 
                  class="w-full"
                />
              </div>
            </div>
          </div>
          
          <button class="btn btn-primary w-full mb-2" @click="startDemo">开始演示</button>
          <button class="btn btn-outline w-full" @click="randomizeArray">
            {{ 
              currentAlgorithm?.type === 'graph' ? '随机图' : 
              currentAlgorithm?.id === 'fractional-knapsack' ? '随机物品' : 
              currentAlgorithm?.id === 'activity-selection' ? '随机活动' : 
              currentAlgorithm?.id === 'fibonacci' ? '重置' :
              currentAlgorithm?.id === 'lcs' ? '重置' :
              currentAlgorithm?.id === '01-knapsack-bb' ? '随机物品' :
              '随机数组' 
            }}
          </button>
        </div>
      </div>
      
      <div class="lg:col-span-6">
        <div class="card h-full">
          <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-semibold">{{ currentAlgorithm?.name || '请选择算法' }}</h3>
              <div class="flex space-x-2">
                <button class="btn btn-outline" @click="resetDemo">重置</button>
                <button class="btn btn-outline" @click="randomizeArray">
                  {{ 
                    currentAlgorithm?.type === 'graph' ? '随机图' : 
                    currentAlgorithm?.id === 'fractional-knapsack' ? '随机物品' : 
                    currentAlgorithm?.id === 'activity-selection' ? '随机活动' : 
                    '随机数组' 
                  }}
                </button>
              </div>
            </div>
          
          <div class="debug-info mb-2 text-xs text-gray-500">
            <span v-if="currentAlgorithm?.type === 'graph'">调试: 节点数={{ displayGraph.nodes.length }}, 边数={{ displayGraph.edges.length }}</span>
            <span v-else-if="currentAlgorithm?.id === 'fractional-knapsack'">调试: 物品数={{ displayKnapsackItems.length }}</span>
            <span v-else-if="currentAlgorithm?.id === 'activity-selection'">调试: 活动数={{ displayActivities.length }}</span>
            <span v-else-if="currentAlgorithm?.id === 'fibonacci'">调试: n={{ fibonacciNumber }}, dp长度={{ displayFibonacci.dp.length }}</span>
            <span v-else-if="currentAlgorithm?.id === 'lcs'">调试: str1={{ lcsString1 }}, str2={{ lcsString2 }}</span>
            <span v-else-if="currentAlgorithm?.id === '01-knapsack-bb'">调试: 物品数={{ displayBbKnapsackItems.length }}, 容量={{ bbKnapsackCapacity }}</span>
            <span v-else>调试: array长度={{ array.length }}, displayArray长度={{ displayArray.length }}</span>
            , steps长度={{ steps.length }}
          </div>
          
          <div class="visualization-container bg-gray-50 rounded-lg p-4" style="min-height: 450px; height: 450px;">
            <div v-if="currentAlgorithm?.type === 'sort' || currentAlgorithm?.type === 'search' || currentAlgorithm?.id === 'merge-sort'" class="h-full flex flex-col">
              <!-- 归并排序信息显示 -->
              <div v-if="currentAlgorithm?.id === 'merge-sort' && steps[currentStep]?.mergeRange" class="mb-2 p-2 bg-white rounded-lg shadow text-sm">
                <div class="font-semibold">合并区间: [{{ steps[currentStep].mergeRange.start }}, {{ steps[currentStep].mergeRange.end }}]</div>
                <div class="text-xs text-gray-600">
                  左子数组: [{{ steps[currentStep].mergeRange.start }}, {{ steps[currentStep].mergeRange.mid }}]
                  <span v-if="steps[currentStep].leftArray" class="ml-2">({{ steps[currentStep].leftArray.join(', ') }})</span>
                </div>
                <div class="text-xs text-gray-600">
                  右子数组: [{{ steps[currentStep].mergeRange.mid + 1 }}, {{ steps[currentStep].mergeRange.end }}]
                  <span v-if="steps[currentStep].rightArray" class="ml-2">({{ steps[currentStep].rightArray.join(', ') }})</span>
                </div>
              </div>
              
              <!-- 柱状图可视化 -->
              <div class="bars-container flex items-end justify-center flex-1 gap-1 overflow-x-auto p-4">
                <div 
                  v-for="(value, index) in displayArray" 
                  :key="index"
                  class="bar-item flex-shrink-0 rounded-t-md transition-all duration-300 flex flex-col items-center justify-end relative"
                  :style="getBarStyle(value, index)"
                  :class="getBarClass(index)"
                >
                  <span class="bar-value text-xs text-white py-1 font-bold absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded px-1">{{ value }}</span>
                </div>
              </div>
            </div>
            <div v-else-if="currentAlgorithm?.type === 'graph'" class="graph-container h-full relative flex flex-col">
              <div v-if="steps[currentStep] && (currentAlgorithm?.id === 'bfs' || currentAlgorithm?.id === 'dfs')" class="p-3 bg-blue-50 rounded-lg mb-2">
                <div class="text-sm font-semibold">
                  {{ currentAlgorithm?.id === 'bfs' ? '队列' : '栈' }}: [{{ formatNodeLabels(steps[currentStep].queue || steps[currentStep].stack || []).join(', ') }}]
                </div>
                <div class="text-sm">已访问: [{{ formatNodeLabels(steps[currentStep].visited || []).join(', ') }}]</div>
              </div>
              <div class="flex-1">
                <svg width="100%" height="100%" viewBox="0 0 400 400">
                <g class="edges">
                  <line 
                    v-for="(edge, index) in displayGraph.edges" 
                    :key="`edge-${index}`"
                    :x1="getNodeById(edge.from)?.x"
                    :y1="getNodeById(edge.from)?.y"
                    :x2="getNodeById(edge.to)?.x"
                    :y2="getNodeById(edge.to)?.y"
                    :class="getEdgeClass(edge)"
                    stroke-width="2"
                  />
                </g>
                <g class="nodes">
                  <g 
                    v-for="node in displayGraph.nodes" 
                    :key="`node-${node.id}`"
                    :transform="`translate(${node.x}, ${node.y})`"
                  >
                    <circle 
                      r="25"
                      :class="getNodeClass(node)"
                      stroke-width="3"
                    />
                    <text 
                      class="text-sm fill-white font-bold"
                      text-anchor="middle"
                      dy="5"
                    >
                      {{ node.label }}
                    </text>
                    <text 
                      v-if="currentAlgorithm?.id === 'dijkstra' && node.distance !== undefined && node.distance !== Infinity"
                      class="text-xs fill-gray-600 font-semibold"
                      text-anchor="middle"
                      dy="45"
                    >
                      d={{ node.distance }}
                    </text>
                  </g>
                </g>
              </svg>
              </div>
            </div>
            <div v-else-if="currentAlgorithm?.id === 'fractional-knapsack'" class="h-full overflow-y-auto">
              <div v-if="steps[currentStep]">
                <div class="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div class="text-sm font-semibold">背包容量: {{ steps[currentStep].capacity }} | 已用: {{ steps[currentStep].usedCapacity }} | 总价值: {{ steps[currentStep].totalValue?.toFixed(1) }}</div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div 
                    v-for="item in steps[currentStep].items" 
                    :key="item.id"
                    class="p-3 rounded-lg border-2 transition-all"
                    :class="item.selected ? (item.fraction === 1 ? 'bg-green-100 border-green-400' : 'bg-yellow-100 border-yellow-400') : (steps[currentStep].highlightItems?.includes(item.id) ? 'bg-red-100 border-red-400' : 'bg-white border-gray-200')"
                  >
                    <div class="text-lg font-bold">物品 {{ String.fromCharCode(65 + item.id) }}</div>
                    <div class="text-sm">重量: {{ item.weight }}</div>
                    <div class="text-sm">价值: {{ item.value }}</div>
                    <div class="text-sm text-gray-600">单位价值: {{ item.ratio || (item.value / item.weight).toFixed(2) }}</div>
                    <div v-if="item.selected" class="text-sm font-semibold mt-1">
                      已选: {{ item.fraction === 1 ? '全部' : (item.fraction * 100).toFixed(0) + '%' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="currentAlgorithm?.id === 'activity-selection'" class="h-full overflow-y-auto">
              <div v-if="steps[currentStep]">
                <div class="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div class="text-sm font-semibold">已选活动: {{ steps[currentStep].selectedActivities?.length || 0 }} 个 | 最后结束时间: {{ steps[currentStep].lastEnd }}</div>
                </div>
                <div class="space-y-2">
                  <div 
                    v-for="activity in steps[currentStep].activities" 
                    :key="activity.id"
                    class="p-3 rounded-lg border-2 transition-all"
                    :class="activity.selected ? 'bg-green-100 border-green-400' : (steps[currentStep].highlightActivities?.includes(activity.id) ? 'bg-red-100 border-red-400' : 'bg-white border-gray-200')"
                  >
                    <div class="flex items-center justify-between">
                      <div class="text-lg font-bold">活动 {{ activity.name }}</div>
                      <div class="text-sm font-semibold" :class="activity.selected ? 'text-green-700' : ''">
                        {{ activity.selected ? '✓ 已选' : '' }}
                      </div>
                    </div>
                    <div class="text-sm mt-1">时间: [{{ activity.start }}, {{ activity.end }}]</div>
                    <div class="mt-2 h-8 bg-gray-200 rounded relative overflow-hidden">
                      <div 
                        class="h-full absolute top-0 left-0 rounded transition-all"
                        :class="activity.selected ? 'bg-green-500' : (steps[currentStep].highlightActivities?.includes(activity.id) ? 'bg-red-400' : 'bg-gray-400')"
                        :style="{
                          left: (activity.start / 20 * 100) + '%',
                          width: ((activity.end - activity.start) / 20 * 100) + '%'
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="currentAlgorithm?.id === 'fibonacci'" class="h-full overflow-y-auto">
              <div v-if="steps[currentStep]">
                <div class="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div class="text-sm font-semibold">斐波那契数列: n = {{ steps[currentStep].n }}, 当前 i = {{ steps[currentStep].i }}</div>
                </div>
                <div class="mb-4">
                  <h4 class="text-sm font-semibold mb-2">DP 数组</h4>
                  <div class="flex flex-wrap gap-2">
                    <div 
                      v-for="(value, index) in steps[currentStep].dp" 
                      :key="index"
                      class="px-4 py-2 rounded-lg border-2 transition-all min-w-[80px] text-center"
                      :class="index === steps[currentStep].i ? 'bg-yellow-100 border-yellow-400' : (index <= steps[currentStep].i ? 'bg-green-100 border-green-400' : 'bg-white border-gray-200')"
                    >
                      <div class="text-xs text-gray-500">F({{ index }})</div>
                      <div class="text-lg font-bold">{{ value }}</div>
                    </div>
                  </div>
                </div>
                <div v-if="steps[currentStep].formula" class="p-3 bg-gray-100 rounded-lg">
                  <div class="text-sm font-mono">{{ steps[currentStep].formula }}</div>
                </div>
              </div>
            </div>
            <div v-else-if="currentAlgorithm?.id === 'lcs'" class="h-full overflow-y-auto">
              <div v-if="steps[currentStep]">
                <div class="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div class="text-sm font-semibold">最长公共子序列: 当前 i = {{ steps[currentStep].i }}, j = {{ steps[currentStep].j }}</div>
                  <div v-if="steps[currentStep].lcs" class="text-sm mt-1">当前 LCS: {{ steps[currentStep].lcs }}</div>
                </div>
                <div class="mb-4">
                  <h4 class="text-sm font-semibold mb-2">DP 表格</h4>
                  <div class="overflow-x-auto">
                    <table class="border-collapse">
                      <tbody>
                        <tr>
                          <td class="border border-gray-300 px-2 py-1 text-center"></td>
                          <td class="border border-gray-300 px-2 py-1 text-center bg-gray-200"></td>
                          <td 
                            v-for="(char, index) in steps[currentStep].str2" 
                            :key="index"
                            class="border border-gray-300 px-3 py-1 text-center bg-gray-200 font-semibold"
                          >
                            {{ char }}
                          </td>
                        </tr>
                        <tr v-for="(row, i) in steps[currentStep].dp" :key="i">
                          <td class="border border-gray-300 px-2 py-1 text-center bg-gray-200 font-semibold">
                            {{ i === 0 ? '' : steps[currentStep].str1[i - 1] }}
                          </td>
                          <td 
                            v-for="(cell, j) in row" 
                            :key="j"
                            class="border border-gray-300 px-3 py-2 text-center min-w-[40px] transition-all relative"
                            :class="{
                              'bg-yellow-100 font-bold ring-2 ring-yellow-400': steps[currentStep].currentCell && steps[currentStep].currentCell[0] === i && steps[currentStep].currentCell[1] === j,
                              'bg-green-50 font-medium': steps[currentStep].highlightPath && steps[currentStep].highlightPath.some(path => path[0] === i && path[1] === j),
                              'bg-white': !steps[currentStep].currentCell || (steps[currentStep].currentCell[0] !== i || steps[currentStep].currentCell[1] !== j) && (!steps[currentStep].highlightPath || !steps[currentStep].highlightPath.some(path => path[0] === i && path[1] === j))
                            }"
                          >
                            {{ cell }}
                            <div v-if="steps[currentStep].currentCell && steps[currentStep].currentCell[0] === i && steps[currentStep].currentCell[1] === j" class="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-white">
                              ↓
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div v-if="steps[currentStep].formula" class="p-3 bg-gray-100 rounded-lg">
                  <div class="text-sm font-mono">{{ steps[currentStep].formula }}</div>
                </div>
              </div>
            </div>
            <div v-else-if="currentAlgorithm?.id === '01-knapsack-bb'" class="h-full overflow-y-auto">
              <div v-if="steps[currentStep]">
                <div class="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div class="text-sm font-semibold">背包容量: {{ steps[currentStep].capacity }} | 当前价值: {{ steps[currentStep].currentValue }} | 最优价值: {{ steps[currentStep].bestValue }}</div>
                </div>
                <div class="mb-4">
                  <h4 class="text-sm font-semibold mb-2">物品列表</h4>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div 
                      v-for="item in steps[currentStep].items" 
                      :key="item.id"
                      class="p-3 rounded-lg border-2 transition-all"
                      :class="item.selected ? 'bg-green-100 border-green-400' : (steps[currentStep].highlightItems?.includes(item.id) ? 'bg-yellow-100 border-yellow-400' : 'bg-white border-gray-200')"
                    >
                      <div class="text-lg font-bold">物品 {{ String.fromCharCode(65 + item.id) }}</div>
                      <div class="text-sm">重量: {{ item.weight }}</div>
                      <div class="text-sm">价值: {{ item.value }}</div>
                      <div class="text-sm text-gray-600">单位价值: {{ (item.value / item.weight).toFixed(2) }}</div>
                      <div v-if="item.selected" class="text-sm font-semibold mt-1">✓ 已选</div>
                    </div>
                  </div>
                </div>
                <div v-if="steps[currentStep].queueInfo" class="p-3 bg-gray-100 rounded-lg mb-4">
                  <div class="text-sm font-semibold mb-1">优先队列状态</div>
                  <div class="text-xs font-mono">{{ steps[currentStep].queueInfo }}</div>
                </div>
                <div v-if="steps[currentStep].explanation" class="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div class="text-sm font-semibold mb-1">算法说明</div>
                  <div class="text-sm text-gray-700">{{ steps[currentStep].explanation }}</div>
                </div>
              </div>
            </div>
            <div v-else-if="currentAlgorithm?.type === 'tree'" class="h-full flex flex-col">
              <div v-if="steps[currentStep]">
                <div class="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div class="text-sm font-semibold">遍历结果: {{ steps[currentStep].result?.join(' → ') || '' }}</div>
                </div>
                <div class="flex-1 flex items-center justify-center">
                  <div class="tree-container" ref="treeContainer">
                    <template v-if="steps[currentStep].tree">
                      <svg width="800" height="400" viewBox="0 0 800 400">
                        <g>
                          <template v-for="node in steps[currentStep].tree.nodes" :key="node.id">
                            <!-- 绘制连接线 -->
                            <line 
                              v-if="node.parent !== null"
                              :x1="node.x"
                              :y1="node.y"
                              :x2="getTreeParentNode(node.parent).x"
                              :y2="getTreeParentNode(node.parent).y"
                              stroke="#9ca3af"
                              stroke-width="2"
                            />
                            <!-- 绘制节点 -->
                            <circle 
                              :cx="node.x"
                              :cy="node.y"
                              r="20"
                              :class="node.id === steps[currentStep].highlightNode ? 'fill-red-500' : (node.visited ? 'fill-green-500' : 'fill-blue-500')"
                              stroke="white"
                              stroke-width="2"
                            />
                            <text 
                              :x="node.x"
                              :y="node.y"
                              text-anchor="middle"
                              dy=".3em"
                              class="text-white font-bold"
                            >
                              {{ node.value }}
                            </text>
                          </template>
                        </g>
                      </svg>
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="flex items-center justify-center h-80">
              <p class="text-gray-500">请选择算法</p>
            </div>
          </div>
          
          <div v-if="currentStepCode" class="mt-4 p-4 bg-gray-100 rounded-md">
            <h4 class="text-sm font-medium text-gray-700 mb-2">当前步骤</h4>
            <pre class="text-sm font-mono">{{ currentStepCode }}</pre>
          </div>
        </div>
      </div>
      
      <div class="lg:col-span-3">
        <div class="card h-full">
          <h3 class="text-lg font-semibold mb-4">步骤说明</h3>
          
          <div ref="stepsContainer" class="mb-6 max-h-64 overflow-y-auto">
            <div 
              v-for="(step, index) in steps" 
              :key="index"
              :ref="el => { if (el) stepElements[index] = el }"
              class="p-3 border rounded-md mb-2 transition-colors"
              :class="currentStep === index ? 'bg-blue-50 border-blue-200' : 'bg-white'"
            >
              <div class="flex items-start">
                <div class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-3 flex-shrink-0">
                  <span class="text-sm">{{ index + 1 }}</span>
                </div>
                <div>
                  <p class="text-sm">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="border-t pt-4">
            <h4 class="text-sm font-medium text-gray-700 mb-2">控制</h4>
            <div class="flex justify-center space-x-4 mb-4">
              <button class="btn btn-outline" @click="prevStep" :disabled="currentStep === 0">
                上一步
              </button>
              <button class="btn btn-primary" @click="togglePlay">
                {{ isPlaying ? '暂停' : '播放' }}
              </button>
              <button class="btn btn-outline" @click="nextStep" :disabled="currentStep === steps.length - 1">
                下一步
              </button>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-gray-600">步骤 {{ currentStep + 1 }} / {{ steps.length }}</span>
              <button class="btn btn-outline px-3 py-1" @click="resetDemo">
                重置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const categories = ref([
  { id: 'sort', name: '排序算法' },
  { id: 'search', name: '搜索算法' },
  { id: 'graph', name: '图论算法' },
  { id: 'greedy', name: '贪心算法' },
  { id: 'divide', name: '分治算法' },
  { id: 'dp', name: '动态规划' },
  { id: 'bb', name: '分支限界法' },
  { id: 'tree', name: '树算法' }
])

const algorithms = ref([
  { id: 'bubble', name: '冒泡排序', type: 'sort' },
  { id: 'quick', name: '快速排序', type: 'sort' },
  { id: 'binary', name: '二分查找', type: 'search' },
  { id: 'dijkstra', name: 'Dijkstra算法', type: 'graph' },
  { id: 'bfs', name: '广度优先搜索(BFS)', type: 'graph' },
  { id: 'dfs', name: '深度优先搜索(DFS)', type: 'graph' },
  { id: 'fractional-knapsack', name: '分数背包', type: 'greedy' },
  { id: 'activity-selection', name: '活动选择', type: 'greedy' },
  { id: 'merge-sort', name: '归并排序', type: 'divide' },
  { id: 'fibonacci', name: '斐波那契数列', type: 'dp' },
  { id: 'lcs', name: '最长公共子序列', type: 'dp' },
  { id: '01-knapsack-bb', name: '0-1背包(分支限界)', type: 'bb' },
  { id: 'tree-preorder', name: '二叉树前序遍历', type: 'tree' },
  { id: 'tree-inorder', name: '二叉树中序遍历', type: 'tree' },
  { id: 'tree-postorder', name: '二叉树后序遍历', type: 'tree' }
])

const filteredAlgorithms = computed(() => {
  return algorithms.value.filter(a => {
    if (activeCategory.value === 'sort') return a.type === 'sort'
    if (activeCategory.value === 'search') return a.type === 'search'
    if (activeCategory.value === 'graph') return a.type === 'graph'
    if (activeCategory.value === 'greedy') return a.type === 'greedy'
    if (activeCategory.value === 'divide') return a.type === 'divide'
    if (activeCategory.value === 'dp') return a.type === 'dp'
    if (activeCategory.value === 'bb') return a.type === 'bb'
    if (activeCategory.value === 'tree') return a.type === 'tree'
    return true
  })
})

const activeCategory = ref('sort')
const activeAlgorithm = ref('bubble')
const currentAlgorithm = ref(algorithms.value[0])
const params = ref({
  arraySize: 8,
  speed: 5
})
const array = ref([])
const displayArray = ref([])
const steps = ref([])
const currentStep = ref(0)
const isPlaying = ref(false)
const highlightedIndices = ref([])
const sortedIndices = ref([])
const currentStepCode = ref('')
const stepsContainer = ref(null)
const stepElements = ref([])
let playTimer = null

const graph = ref({ nodes: [], edges: [] })
const displayGraph = ref({ nodes: [], edges: [] })
const startNode = ref(0)

// 贪心算法数据
const knapsackItems = ref([])
const displayKnapsackItems = ref([])
const knapsackCapacity = ref(15)
const activities = ref([])
const displayActivities = ref([])

// 动态规划数据
const fibonacciNumber = ref(10)
const displayFibonacci = ref({ dp: [], i: 0, j: 0 })
const lcsString1 = ref('ABCBDAB')
const lcsString2 = ref('BDCABA')
const displayLcs = ref({ dp: [], i: 0, j: 0, lcs: '' })

// 分支限界法数据
const bbKnapsackItems = ref([])
const displayBbKnapsackItems = ref([])
const bbKnapsackCapacity = ref(10)
const bbQueue = ref([])

// 树算法数据
const tree = ref(null)
const displayTree = ref(null)
const treeTraversalResult = ref([])

const speedDelay = computed(() => {
  return (11 - params.value.speed) * 300
})

const getBarStyle = (value, index) => {
  const barWidth = Math.max(28, Math.min(60, 500 / displayArray.value.length))
  const maxValue = Math.max(...displayArray.value)
  const barHeight = Math.max((value / maxValue) * 300, 40)
  return {
    height: `${barHeight}px`,
    width: `${barWidth}px`,
    minWidth: '24px',
    minHeight: '40px'
  }
}

const getBarClass = (index) => {
  const classes = []
  const step = steps.value[currentStep.value]
  
  if (!step) {
    return 'bg-blue-500'
  }
  
  if (step.highlight && step.highlight.includes(index)) {
    classes.push('bg-red-500')
  } else if (step.mergeRange) {
    const { start, mid, end } = step.mergeRange
    if (index >= start && index <= mid) {
      classes.push('bg-yellow-400')
    } else if (index > mid && index <= end) {
      classes.push('bg-purple-400')
    } else if (step.sorted !== undefined && step.sorted > 0) {
      const sortedStart = displayArray.value.length - step.sorted
      if (index >= sortedStart) {
        classes.push('bg-green-500')
      } else {
        classes.push('bg-blue-500')
      }
    } else {
      classes.push('bg-blue-500')
    }
  } else if (step.sorted !== undefined) {
    const sortedStart = displayArray.value.length - step.sorted
    if (index >= sortedStart) {
      classes.push('bg-green-500')
    } else {
      classes.push('bg-blue-500')
    }
  } else {
    classes.push('bg-blue-500')
  }
  
  return classes.join(' ')
}

const getNodeById = (id) => {
  return displayGraph.value.nodes.find(n => n.id === id)
}

const getNodeClass = (node) => {
  const step = steps.value[currentStep.value]
  const isHighlighted = step?.highlightNodes?.includes(node.id)
  const isVisited = node.visited
  
  if (isHighlighted) {
    return 'fill-red-500 stroke-red-700'
  } else if (isVisited) {
    return 'fill-green-500 stroke-green-700'
  } else {
    return 'fill-blue-500 stroke-blue-700'
  }
}

const getEdgeClass = (edge) => {
  const step = steps.value[currentStep.value]
  const isHighlighted = step?.highlightEdges?.some(
    e => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from)
  )
  
  if (isHighlighted) {
    return 'stroke-red-500'
  } else {
    return 'stroke-gray-400'
  }
}

const generateRandomArray = () => {
  array.value = []
  for (let i = 0; i < params.value.arraySize; i++) {
    array.value.push(Math.floor(Math.random() * 20) + 1)
  }
  displayArray.value = [...array.value]
  console.log('[Algorithm] Generated array:', array.value)
  console.log('[Algorithm] displayArray:', displayArray.value)
}

const selectAlgorithm = (algorithm) => {
  currentAlgorithm.value = algorithm
  activeAlgorithm.value = algorithm.id
  if (algorithm.type === 'graph') {
    generateRandomGraph()
  } else if (algorithm.type === 'greedy') {
    if (algorithm.id === 'fractional-knapsack') {
      generateRandomKnapsackItems()
    } else if (algorithm.id === 'activity-selection') {
      generateRandomActivities()
    }
  } else if (algorithm.type === 'dp') {
    // 动态规划算法不需要额外初始化
  } else if (algorithm.type === 'bb') {
    if (algorithm.id === '01-knapsack-bb') {
      generateRandomBbKnapsackItems()
    }
  } else if (algorithm.type === 'tree') {
    generateRandomTree()
  } else {
    generateRandomArray()
  }
  generateSteps()
}

const randomizeArray = () => {
  if (currentAlgorithm.value.type === 'graph') {
    generateRandomGraph()
  } else if (currentAlgorithm.value.type === 'greedy') {
    if (currentAlgorithm.value.id === 'fractional-knapsack') {
      generateRandomKnapsackItems()
    } else if (currentAlgorithm.value.id === 'activity-selection') {
      generateRandomActivities()
    }
  } else if (currentAlgorithm.value.type === 'dp') {
    // 动态规划算法不需要随机化
  } else if (currentAlgorithm.value.type === 'bb') {
    if (currentAlgorithm.value.id === '01-knapsack-bb') {
      generateRandomBbKnapsackItems()
    }
  } else if (currentAlgorithm.value.type === 'tree') {
    generateRandomTree()
  } else {
    generateRandomArray()
  }
  generateSteps()
}

const generateSteps = () => {
  steps.value = []
  switch (currentAlgorithm.value.id) {
    case 'bubble':
      generateBubbleSortSteps()
      break
    case 'quick':
      generateQuickSortSteps()
      break
    case 'binary':
      generateBinarySearchSteps()
      break
    case 'dijkstra':
      generateDijkstraSteps()
      break
    case 'bfs':
      generateBfsSteps()
      break
    case 'dfs':
      generateDfsSteps()
      break
    case 'fractional-knapsack':
      generateFractionalKnapsackSteps()
      break
    case 'activity-selection':
      generateActivitySelectionSteps()
      break
    case 'merge-sort':
      generateMergeSortSteps()
      break
    case 'fibonacci':
      generateFibonacciSteps()
      break
    case 'lcs':
      generateLcsSteps()
      break
    case '01-knapsack-bb':
      generate01KnapsackBbSteps()
      break
    case 'tree-preorder':
      generateTreeTraversalSteps('preorder')
      break
    case 'tree-inorder':
      generateTreeTraversalSteps('inorder')
      break
    case 'tree-postorder':
      generateTreeTraversalSteps('postorder')
      break
  }
  currentStep.value = 0
  updateCurrentStep()
  console.log('[Algorithm] Steps generated:', steps.value.length)
}

// 生成归并排序步骤
const generateMergeSortSteps = () => {
  const arr = [...array.value]
  steps.value = []
  
  const mergeSort = (array, start = 0, end = array.length - 1, depth = 0) => {
    if (start >= end) return
    
    const mid = Math.floor((start + end) / 2)
    
    steps.value.push({
      description: `分治：将 [${start}, ${end}] 分为 [${start}, ${mid}] 和 [${mid + 1}, ${end}]`,
      code: `mergeSort(arr, ${start}, ${mid}); mergeSort(arr, ${mid + 1}, ${end});`,
      array: [...array],
      highlight: [],
      mergeRange: { start, mid, end },
      sorted: 0
    })
    
    // 递归排序左半部分
    mergeSort(array, start, mid, depth + 1)
    
    // 递归排序右半部分
    mergeSort(array, mid + 1, end, depth + 1)
    
    // 合并两个已排序的子数组
    merge(array, start, mid, end)
  }
  
  const merge = (array, start, mid, end) => {
    const left = array.slice(start, mid + 1)
    const right = array.slice(mid + 1, end + 1)
    
    steps.value.push({
      description: `合并：左子数组 [${left.join(', ')}]，右子数组 [${right.join(', ')}]`,
      code: `merge(arr, ${start}, ${mid}, ${end});`,
      array: [...array],
      highlight: [],
      mergeRange: { start, mid, end },
      leftArray: [...left],
      rightArray: [...right],
      sorted: 0
    })
    
    let i = 0, j = 0, k = start
    const originalArray = [...array]
    
    // 合并过程
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        array[k] = left[i]
        i++
      } else {
        array[k] = right[j]
        j++
      }
      k++
    }
    
    // 放入剩余的左子数组元素
    while (i < left.length) {
      array[k] = left[i]
      i++
      k++
    }
    
    // 放入剩余的右子数组元素
    while (j < right.length) {
      array[k] = right[j]
      j++
      k++
    }
    
    steps.value.push({
      description: `合并结果：[${array.slice(start, end + 1).join(', ')}]`,
      code: `// 合并完成`,
      array: [...array],
      highlight: [],
      mergeRange: { start, mid, end },
      sorted: 0
    })
  }
  
  mergeSort(arr)
  
  steps.value.push({
    description: '归并排序完成！',
    code: '// 排序完成',
    array: [...arr],
    highlight: [],
    sorted: arr.length
  })
  
  // 添加完整代码示例
  steps.value.push({
    description: '完整代码示例',
    code: `// 归并排序完整代码
function mergeSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;
  
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }
  
  // 处理剩余元素
  while (i < left.length) {
    result.push(left[i]);
    i++;
  }
  
  while (j < right.length) {
    result.push(right[j]);
    j++;
  }
  
  return result;
}

// 示例调用
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(mergeSort(array)); // 输出: [11, 12, 22, 25, 34, 64, 90]`,
    array: [...arr],
    highlight: [],
    sorted: arr.length
  })
}

// 生成斐波那契数列步骤
const generateFibonacciSteps = () => {
  const n = fibonacciNumber.value
  steps.value = []
  
  const dp = new Array(n + 1).fill(0)
  dp[0] = 0
  if (n >= 1) dp[1] = 1
  
  steps.value.push({
    id: 'fibonacci',
    description: '初始化：F(0) = 0, F(1) = 1',
    code: 'dp[0] = 0; dp[1] = 1;',
    n: n,
    dp: [...dp],
    i: 0,
    formula: 'F(0) = 0, F(1) = 1'
  })
  
  for (let i = 2; i <= n; i++) {
    steps.value.push({
      id: 'fibonacci',
      description: `计算 F(${i})`,
      code: `dp[${i}] = dp[${i-1}] + dp[${i-2}];`,
      n: n,
      dp: [...dp],
      i: i,
      formula: `F(${i}) = F(${i-1}) + F(${i-2})`
    })
    
    dp[i] = dp[i - 1] + dp[i - 2]
    
    steps.value.push({
      id: 'fibonacci',
      description: `F(${i}) = ${dp[i]}`,
      code: `// F(${i}) = ${dp[i]}`,
      n: n,
      dp: [...dp],
      i: i,
      formula: `F(${i}) = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`
    })
  }
  
  steps.value.push({
    id: 'fibonacci',
    description: `斐波那契数列完成！F(${n}) = ${dp[n]}`,
    code: '// 动态规划完成',
    n: n,
    dp: [...dp],
    i: n,
    formula: `F(${n}) = ${dp[n]}`
  })
  
  // 添加完整代码示例
  steps.value.push({
    id: 'fibonacci',
    description: '完整代码示例',
    code: `// 斐波那契数列完整代码（动态规划）
function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  
  return dp[n];
}

// 斐波那契数列完整代码（递归）
function fibonacciRecursive(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacciRecursive(n - 1) + fibonacciRecursive(n - 2);
}

// 示例调用
console.log('斐波那契数列第 10 项:', fibonacci(10)); // 输出: 55
console.log('斐波那契数列第 10 项（递归）:', fibonacciRecursive(10)); // 输出: 55`,
    n: n,
    dp: [...dp],
    i: n,
    formula: `F(${n}) = ${dp[n]}`
  })
}

// 生成最长公共子序列步骤
const generateLcsSteps = () => {
  const str1 = lcsString1.value
  const str2 = lcsString2.value
  const m = str1.length
  const n = str2.length
  steps.value = []
  
  const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0))
  
  steps.value.push({
    id: 'lcs',
    description: `初始化 DP 表格 (${m+1}x${n+1})`,
    code: `dp = Array(${m+1}).fill(0).map(() => Array(${n+1}).fill(0));`,
    str1: str1,
    str2: str2,
    dp: dp.map(row => [...row]),
    i: -1,
    j: -1,
    lcs: '',
    formula: '',
    highlightPath: [],
    currentCell: null
  })
  
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i === 0 || j === 0) {
        dp[i][j] = 0
      } else if (str1[i - 1] === str2[j - 1]) {
        steps.value.push({
          id: 'lcs',
          description: `字符匹配: str1[${i-1}] = "${str1[i-1]}", str2[${j-1}] = "${str2[j-1]}"`,
          code: `if (str1[${i-1}] === str2[${j-1}])`,
          str1: str1,
          str2: str2,
          dp: dp.map(row => [...row]),
          i: i - 1,
          j: j - 1,
          lcs: '',
          formula: `dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1`,
          highlightPath: [[i-1, j-1], [i, j]],
          currentCell: [i, j]
        })
        
        dp[i][j] = dp[i - 1][j - 1] + 1
        
        steps.value.push({
          id: 'lcs',
          description: `dp[${i}][${j}] = ${dp[i][j]} (匹配)`,
          code: `dp[${i}][${j}] = dp[${i-1}][${j-1}] + 1;`,
          str1: str1,
          str2: str2,
          dp: dp.map(row => [...row]),
          i: i - 1,
          j: j - 1,
          lcs: '',
          formula: `dp[${i}][${j}] = ${dp[i-1][j-1]} + 1 = ${dp[i][j]}`,
          highlightPath: [[i-1, j-1], [i, j]],
          currentCell: [i, j]
        })
      } else {
        const maxVal = Math.max(dp[i - 1][j], dp[i][j - 1])
        const fromCell = dp[i - 1][j] > dp[i][j - 1] ? [i-1, j] : [i, j-1]
        
        steps.value.push({
          id: 'lcs',
          description: `字符不匹配: str1[${i-1}] = "${str1[i-1]}", str2[${j-1}] = "${str2[j-1]}"`,
          code: `else`,
          str1: str1,
          str2: str2,
          dp: dp.map(row => [...row]),
          i: i - 1,
          j: j - 1,
          lcs: '',
          formula: `dp[${i}][${j}] = max(dp[${i-1}][${j}], dp[${i}][${j-1}])`,
          highlightPath: [fromCell, [i, j]],
          currentCell: [i, j]
        })
        
        dp[i][j] = maxVal
        
        steps.value.push({
          id: 'lcs',
          description: `dp[${i}][${j}] = ${dp[i][j]} (取最大值)`,
          code: `dp[${i}][${j}] = Math.max(dp[${i-1}][${j}], dp[${i}][${j-1}]);`,
          str1: str1,
          str2: str2,
          dp: dp.map(row => [...row]),
          i: i - 1,
          j: j - 1,
          lcs: '',
          formula: `dp[${i}][${j}] = max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}`,
          highlightPath: [fromCell, [i, j]],
          currentCell: [i, j]
        })
      }
    }
  }
  
  // 回溯找出 LCS
  let lcsResult = ''
  let i = m, j = n
  const backtrackPath = []
  
  steps.value.push({
    id: 'lcs',
    description: '开始回溯找出最长公共子序列',
    code: '// 开始回溯',
    str1: str1,
    str2: str2,
    dp: dp.map(row => [...row]),
    i: m - 1,
    j: n - 1,
    lcs: '',
    formula: '开始回溯过程',
    highlightPath: [[m, n]],
    currentCell: [m, n]
  })
  
  while (i > 0 && j > 0) {
    backtrackPath.push([i, j])
    if (str1[i - 1] === str2[j - 1]) {
      lcsResult = str1[i - 1] + lcsResult
      steps.value.push({
        id: 'lcs',
        description: `找到匹配字符: "${str1[i - 1]}"`,
        code: `if (str1[i - 1] === str2[j - 1]) { lcsResult = "${str1[i - 1]}" + lcsResult; }`,
        str1: str1,
        str2: str2,
        dp: dp.map(row => [...row]),
        i: i - 1,
        j: j - 1,
        lcs: lcsResult,
        formula: `LCS 目前: "${lcsResult}"`,
        highlightPath: [[i, j], [i-1, j-1]],
        currentCell: [i-1, j-1]
      })
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      steps.value.push({
        id: 'lcs',
        description: '向上回溯',
        code: `else if (dp[i - 1][j] > dp[i][j - 1]) { i--; }`,
        str1: str1,
        str2: str2,
        dp: dp.map(row => [...row]),
        i: i - 1,
        j: j - 1,
        lcs: lcsResult,
        formula: '向上回溯',
        highlightPath: [[i, j], [i-1, j]],
        currentCell: [i-1, j]
      })
      i--
    } else {
      steps.value.push({
        id: 'lcs',
        description: '向左回溯',
        code: `else { j--; }`,
        str1: str1,
        str2: str2,
        dp: dp.map(row => [...row]),
        i: i - 1,
        j: j - 1,
        lcs: lcsResult,
        formula: '向左回溯',
        highlightPath: [[i, j], [i, j-1]],
        currentCell: [i, j-1]
      })
      j--
    }
  }
  
  steps.value.push({
    id: 'lcs',
    description: `最长公共子序列完成！长度: ${dp[m][n]}, LCS: "${lcsResult}"`,
    code: '// 动态规划完成',
    str1: str1,
    str2: str2,
    dp: dp.map(row => [...row]),
    i: m - 1,
    j: n - 1,
    lcs: lcsResult,
    formula: `LCS = "${lcsResult}", 长度 = ${dp[m][n]}`,
    highlightPath: backtrackPath,
    currentCell: null
  })
  
  // 添加完整代码示例
  steps.value.push({
    id: 'lcs',
    description: '完整代码示例',
    code: `// 最长公共子序列完整代码
function lcs(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  
  // 创建DP表格
  const dp = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0));
  
  // 填充DP表格
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  // 回溯找出LCS
  let lcsResult = '';
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (str1[i - 1] === str2[j - 1]) {
      lcsResult = str1[i - 1] + lcsResult;
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  
  return { length: dp[m][n], lcs: lcsResult };
}

// 示例调用
const str1 = 'ABCBDAB';
const str2 = 'BDCABA';
const result = lcs(str1, str2);
console.log('最长公共子序列长度:', result.length); // 输出: 4
console.log('最长公共子序列:', result.lcs); // 输出: 'BCBA' or 'BDAB'

// 空间优化版本（O(min(m,n)) 空间）
function lcsSpaceOptimized(str1, str2) {
  // 确保str1是较短的字符串
  if (str1.length > str2.length) {
    [str1, str2] = [str2, str1];
  }
  
  const m = str1.length;
  const n = str2.length;
  
  // 只使用两个一维数组
  let prev = Array(n + 1).fill(0);
  let curr = Array(n + 1).fill(0);
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        curr[j] = prev[j - 1] + 1;
      } else {
        curr[j] = Math.max(prev[j], curr[j - 1]);
      }
    }
    // 交换数组
    [prev, curr] = [curr, prev];
  }
  
  return prev[n];
}`,
    str1: str1,
    str2: str2,
    dp: dp.map(row => [...row]),
    i: m - 1,
    j: n - 1,
    lcs: lcsResult,
    formula: `LCS = "${lcsResult}", 长度 = ${dp[m][n]}`
  })
}

// 生成随机背包物品
const generateRandomKnapsackItems = () => {
  knapsackItems.value = []
  const itemCount = 6
  for (let i = 0; i < itemCount; i++) {
    knapsackItems.value.push({
      id: i,
      weight: Math.floor(Math.random() * 8) + 2,
      value: Math.floor(Math.random() * 20) + 5,
      selected: false,
      fraction: 0
    })
  }
  displayKnapsackItems.value = JSON.parse(JSON.stringify(knapsackItems.value))
  console.log('[Algorithm] Generated knapsack items:', knapsackItems.value)
}

// 生成随机活动
const generateRandomActivities = () => {
  activities.value = []
  const activityCount = 8
  const maxTime = 20
  
  for (let i = 0; i < activityCount; i++) {
    // 随机生成开始时间和持续时间
    const duration = Math.floor(Math.random() * 5) + 2
    const start = Math.floor(Math.random() * (maxTime - duration))
    const end = start + duration
    
    activities.value.push({
      id: i,
      name: String.fromCharCode(65 + i),
      start: start,
      end: end,
      selected: false
    })
  }
  
  displayActivities.value = JSON.parse(JSON.stringify(activities.value))
  console.log('[Algorithm] Generated activities:', activities.value)
}

// 生成分数背包步骤
const generateFractionalKnapsackSteps = () => {
  const items = JSON.parse(JSON.stringify(knapsackItems.value))
  steps.value = []
  
  // 按单位价值排序
  items.forEach(item => {
    item.ratio = (item.value / item.weight).toFixed(2)
  })
  items.sort((a, b) => (b.value / b.weight) - (a.value / a.weight))
  
  steps.value.push({
    description: '初始化：按单位价值（价值/重量）排序物品',
    code: 'items.sort(by value/weight descending)',
    items: JSON.parse(JSON.stringify(items)),
    capacity: knapsackCapacity.value,
    totalValue: 0,
    usedCapacity: 0,
    highlightItems: []
  })
  
  let remainingCapacity = knapsackCapacity.value
  let totalValue = 0
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    
    steps.value.push({
      description: `考虑物品 ${String.fromCharCode(65 + item.id)}：重量=${item.weight}，价值=${item.value}，单位价值=${item.ratio}`,
      code: `item ${String.fromCharCode(65 + item.id)}: w=${item.weight}, v=${item.value}, v/w=${item.ratio}`,
      items: JSON.parse(JSON.stringify(items)),
      capacity: knapsackCapacity.value,
      totalValue: totalValue,
      usedCapacity: knapsackCapacity.value - remainingCapacity,
      highlightItems: [item.id]
    })
    
    if (item.weight <= remainingCapacity) {
      // 完全放入
      remainingCapacity -= item.weight
      totalValue += item.value
      item.selected = true
      item.fraction = 1
      
      steps.value.push({
        description: `物品 ${String.fromCharCode(65 + item.id)} 完全放入背包！剩余容量: ${remainingCapacity}`,
        code: `take full item ${String.fromCharCode(65 + item.id)}`,
        items: JSON.parse(JSON.stringify(items)),
        capacity: knapsackCapacity.value,
        totalValue: totalValue,
        usedCapacity: knapsackCapacity.value - remainingCapacity,
        highlightItems: [item.id]
      })
    } else if (remainingCapacity > 0) {
      // 部分放入
      const fraction = remainingCapacity / item.weight
      const partialValue = fraction * item.value
      totalValue += partialValue
      item.selected = true
      item.fraction = fraction
      
      steps.value.push({
        description: `物品 ${String.fromCharCode(65 + item.id)} 部分放入 (${(fraction * 100).toFixed(0)}%)！获得价值: ${partialValue.toFixed(1)}`,
        code: `take ${(fraction * 100).toFixed(0)}% of item ${String.fromCharCode(65 + item.id)}`,
        items: JSON.parse(JSON.stringify(items)),
        capacity: knapsackCapacity.value,
        totalValue: totalValue,
        usedCapacity: knapsackCapacity.value,
        highlightItems: [item.id]
      })
      
      remainingCapacity = 0
      break
    }
  }
  
  steps.value.push({
    description: `背包已满！总价值: ${totalValue.toFixed(1)}`,
    code: '// 贪心算法完成',
    items: JSON.parse(JSON.stringify(items)),
    capacity: knapsackCapacity.value,
    totalValue: totalValue,
    usedCapacity: knapsackCapacity.value,
    highlightItems: []
  })
  
  // 添加完整代码示例
  steps.value.push({
    description: '完整代码示例',
    code: `// 分数背包算法完整代码
function fractionalKnapsack(items, capacity) {
  // 按单位价值排序（价值/重量）
  items.sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
  
  let totalValue = 0;
  let remainingCapacity = capacity;
  const selectedItems = [];
  
  for (const item of items) {
    if (item.weight <= remainingCapacity) {
      // 完全放入
      totalValue += item.value;
      remainingCapacity -= item.weight;
      selectedItems.push({ ...item, fraction: 1 });
    } else if (remainingCapacity > 0) {
      // 部分放入
      const fraction = remainingCapacity / item.weight;
      totalValue += fraction * item.value;
      selectedItems.push({ ...item, fraction: fraction });
      remainingCapacity = 0;
      break;
    }
  }
  
  return { totalValue, selectedItems };
}

// 示例调用
const items = [
  { id: 0, weight: 10, value: 60 },
  { id: 1, weight: 20, value: 100 },
  { id: 2, weight: 30, value: 120 }
];
const capacity = 50;

const result = fractionalKnapsack(items, capacity);
console.log('总价值:', result.totalValue); // 输出: 240
console.log('选中的物品:', result.selectedItems);`,
    items: JSON.parse(JSON.stringify(items)),
    capacity: knapsackCapacity.value,
    totalValue: totalValue,
    usedCapacity: knapsackCapacity.value,
    highlightItems: []
  })
}

// 生成活动选择步骤
const generateActivitySelectionSteps = () => {
  const acts = JSON.parse(JSON.stringify(activities.value))
  steps.value = []
  
  // 按结束时间排序
  acts.sort((a, b) => a.end - b.end)
  
  steps.value.push({
    description: '初始化：按结束时间排序活动',
    code: 'activities.sort(by end time)',
    activities: JSON.parse(JSON.stringify(acts)),
    selectedActivities: [],
    lastEnd: 0,
    highlightActivities: []
  })
  
  const selected = []
  let lastEndTime = 0
  
  for (let i = 0; i < acts.length; i++) {
    const activity = acts[i]
    
    steps.value.push({
      description: `检查活动 ${activity.name}：时间 [${activity.start}, ${activity.end}]`,
      code: `activity ${activity.name}: [${activity.start}, ${activity.end}]`,
      activities: JSON.parse(JSON.stringify(acts)),
      selectedActivities: [...selected],
      lastEnd: lastEndTime,
      highlightActivities: [activity.id]
    })
    
    if (activity.start >= lastEndTime) {
      selected.push(activity.id)
      activity.selected = true
      lastEndTime = activity.end
      
      steps.value.push({
        description: `选择活动 ${activity.name}！下一个活动必须 >= ${lastEndTime} 开始`,
        code: `select activity ${activity.name}`,
        activities: JSON.parse(JSON.stringify(acts)),
        selectedActivities: [...selected],
        lastEnd: lastEndTime,
        highlightActivities: [activity.id]
      })
    } else {
      steps.value.push({
        description: `跳过活动 ${activity.name}：与已选活动冲突`,
        code: `skip activity ${activity.name} (conflict)`,
        activities: JSON.parse(JSON.stringify(acts)),
        selectedActivities: [...selected],
        lastEnd: lastEndTime,
        highlightActivities: [activity.id]
      })
    }
  }
  
  steps.value.push({
    description: `活动选择完成！共选择 ${selected.length} 个活动`,
    code: '// 贪心算法完成',
    activities: JSON.parse(JSON.stringify(acts)),
    selectedActivities: [...selected],
    lastEnd: lastEndTime,
    highlightActivities: []
  })
  
  // 添加完整代码示例
  steps.value.push({
    description: '完整代码示例',
    code: `// 活动选择算法完整代码
function activitySelection(activities) {
  // 按结束时间排序
  activities.sort((a, b) => a.end - b.end);
  
  const selected = [];
  let lastEndTime = 0;
  
  for (const activity of activities) {
    if (activity.start >= lastEndTime) {
      selected.push(activity);
      lastEndTime = activity.end;
    }
  }
  
  return selected;
}

// 示例调用
const activities = [
  { id: 0, name: 'A', start: 1, end: 4 },
  { id: 1, name: 'B', start: 3, end: 5 },
  { id: 2, name: 'C', start: 0, end: 6 },
  { id: 3, name: 'D', start: 5, end: 7 },
  { id: 4, name: 'E', start: 8, end: 9 },
  { id: 5, name: 'F', start: 5, end: 9 }
];

const selectedActivities = activitySelection(activities);
console.log('选中的活动:', selectedActivities.map(a => a.name)); // 输出: ['A', 'D', 'E']
console.log('共选择', selectedActivities.length, '个活动');`,
    activities: JSON.parse(JSON.stringify(acts)),
    selectedActivities: [...selected],
    lastEnd: lastEndTime,
    highlightActivities: []
  })
}

// 生成随机分支限界法背包物品
const generateRandomBbKnapsackItems = () => {
  bbKnapsackItems.value = []
  const itemCount = 5
  for (let i = 0; i < itemCount; i++) {
    bbKnapsackItems.value.push({
      id: i,
      weight: Math.floor(Math.random() * 5) + 2,
      value: Math.floor(Math.random() * 15) + 5,
      selected: false
    })
  }
  displayBbKnapsackItems.value = JSON.parse(JSON.stringify(bbKnapsackItems.value))
  console.log('[Algorithm] Generated BB knapsack items:', bbKnapsackItems.value)
}

// 计算上界（分数背包）
const calculateBound = (items, capacity, startIndex, currentWeight, currentValue) => {
  let bound = currentValue
  let remainingCapacity = capacity - currentWeight
  let i = startIndex
  
  while (i < items.length && items[i].weight <= remainingCapacity) {
    remainingCapacity -= items[i].weight
    bound += items[i].value
    i++
  }
  
  if (i < items.length) {
    bound += (remainingCapacity / items[i].weight) * items[i].value
  }
  
  return bound
}

// 生成分支限界法0-1背包步骤
const generate01KnapsackBbSteps = () => {
  const items = JSON.parse(JSON.stringify(bbKnapsackItems.value))
  const capacity = bbKnapsackCapacity.value
  steps.value = []
  
  // 按单位价值排序
  items.forEach(item => {
    item.ratio = item.value / item.weight
  })
  items.sort((a, b) => b.ratio - a.ratio)
  
  steps.value.push({
    id: '01-knapsack-bb',
    description: '初始化：按单位价值（价值/重量）从高到低排序物品',
    code: 'items.sort(by value/weight descending)',
    items: JSON.parse(JSON.stringify(items)),
    capacity: capacity,
    currentValue: 0,
    bestValue: 0,
    highlightItems: [],
    queueInfo: '优先队列初始化为空',
    explanation: '分支限界法通过优先队列和剪枝策略来高效解决0-1背包问题'
  })
  
  // 使用数组模拟优先队列（按上界降序）
  const queue = []
  let bestValue = 0
  let bestItems = []
  
  // 初始化队列：根节点（不选任何物品）
  const rootNode = {
    level: -1,
    weight: 0,
    value: 0,
    bound: calculateBound(items, capacity, 0, 0, 0),
    selected: []
  }
  queue.push(rootNode)
  
  steps.value.push({
    id: '01-knapsack-bb',
    description: '根节点入队：不选任何物品',
    code: 'queue.push(rootNode)',
    items: JSON.parse(JSON.stringify(items)),
    capacity: capacity,
    currentValue: 0,
    bestValue: bestValue,
    highlightItems: [],
    queueInfo: `队列: [根节点 (上界=${rootNode.bound.toFixed(1)})]`,
    explanation: '根节点表示初始状态：没有选择任何物品，价值为0，上界为可能的最大价值'
  })
  
  while (queue.length > 0) {
    // 取出上界最大的节点
    queue.sort((a, b) => b.bound - a.bound)
    const currentNode = queue.shift()
    
    steps.value.push({
      id: '01-knapsack-bb',
      description: `取出队列中最优节点：当前处理第 ${currentNode.level + 1} 个物品，总重量=${currentNode.weight}，总价值=${currentNode.value}，上界=${currentNode.bound.toFixed(1)}`,
      code: `currentNode = queue.shift() // 取出上界最大的节点`,
      items: items.map((item, idx) => ({
        ...item,
        selected: currentNode.selected.includes(idx)
      })),
      capacity: capacity,
      currentValue: currentNode.value,
      bestValue: bestValue,
      highlightItems: currentNode.level + 1 < items.length ? [items[currentNode.level + 1]?.id] : [],
      queueInfo: `队列大小: ${queue.length}, 最佳价值: ${bestValue}`,
      explanation: '优先处理上界高的节点，因为它们更有可能产生最优解'
    })
    
    // 如果当前节点的上界小于当前最优解，则剪枝
    if (currentNode.bound <= bestValue) {
      steps.value.push({
        id: '01-knapsack-bb',
        description: `剪枝：该分支的最大可能价值 ${currentNode.bound.toFixed(1)} 不超过当前最优解 ${bestValue}`,
        code: 'if (currentNode.bound <= bestValue) prune // 剪枝',
        items: items.map((item, idx) => ({
          ...item,
          selected: currentNode.selected.includes(idx)
        })),
        capacity: capacity,
        currentValue: currentNode.value,
        bestValue: bestValue,
        highlightItems: [],
        queueInfo: `剪枝此分支`,
        explanation: '剪枝可以避免不必要的计算，提高算法效率'
      })
      continue
    }
    
    // 如果到达叶子节点
    if (currentNode.level === items.length - 1) {
      if (currentNode.value > bestValue) {
        bestValue = currentNode.value
        bestItems = [...currentNode.selected]
        
        steps.value.push({
          id: '01-knapsack-bb',
          description: `找到新的最优解！总价值=${bestValue}`,
          code: `bestValue = ${bestValue} // 更新最优解`,
          items: items.map((item, idx) => ({
            ...item,
            selected: bestItems.includes(idx)
          })),
          capacity: capacity,
          currentValue: currentNode.value,
          bestValue: bestValue,
          highlightItems: [],
          queueInfo: `更新最佳价值为 ${bestValue}`,
          explanation: '找到一个完整的物品组合，价值高于当前最优解'
        })
      }
      continue
    }
    
    const nextLevel = currentNode.level + 1
    const nextItem = items[nextLevel]
    
    // 分支1：不选下一个物品
    const notSelectNode = {
      level: nextLevel,
      weight: currentNode.weight,
      value: currentNode.value,
      bound: calculateBound(items, capacity, nextLevel + 1, currentNode.weight, currentNode.value),
      selected: [...currentNode.selected]
    }
    
    steps.value.push({
      id: '01-knapsack-bb',
      description: `分支1：不选物品 ${String.fromCharCode(65 + nextItem.id)}`,
      code: `// 不选物品 ${String.fromCharCode(65 + nextItem.id)}`,
      items: items.map((item, idx) => ({
        ...item,
        selected: currentNode.selected.includes(idx)
      })),
      capacity: capacity,
      currentValue: currentNode.value,
      bestValue: bestValue,
      highlightItems: [nextItem.id],
      queueInfo: `不选分支：上界=${notSelectNode.bound.toFixed(1)}`,
      explanation: '考虑不选择当前物品的情况'
    })
    
    if (notSelectNode.bound > bestValue) {
      queue.push(notSelectNode)
      steps.value.push({
        id: '01-knapsack-bb',
        description: `将不选分支加入队列`,
        code: `queue.push(notSelectNode)`,
        items: items.map((item, idx) => ({
          ...item,
          selected: currentNode.selected.includes(idx)
        })),
        capacity: capacity,
        currentValue: currentNode.value,
        bestValue: bestValue,
        highlightItems: [nextItem.id],
        queueInfo: `队列大小: ${queue.length}`,
        explanation: '该分支仍有可能产生更优解，继续探索'
      })
    } else {
      steps.value.push({
        id: '01-knapsack-bb',
        description: `剪枝不选分支：上界 ${notSelectNode.bound.toFixed(1)} 不超过最佳价值 ${bestValue}`,
        code: '// 剪枝不选分支',
        items: items.map((item, idx) => ({
          ...item,
          selected: currentNode.selected.includes(idx)
        })),
        capacity: capacity,
        currentValue: currentNode.value,
        bestValue: bestValue,
        highlightItems: [nextItem.id],
        queueInfo: `不选分支被剪枝`,
        explanation: '该分支不可能产生更优解，剪枝'
      })
    }
    
    // 分支2：选下一个物品（如果能放下）
    if (currentNode.weight + nextItem.weight <= capacity) {
      const selectNode = {
        level: nextLevel,
        weight: currentNode.weight + nextItem.weight,
        value: currentNode.value + nextItem.value,
        bound: calculateBound(items, capacity, nextLevel + 1, currentNode.weight + nextItem.weight, currentNode.value + nextItem.value),
        selected: [...currentNode.selected, nextItem.id]
      }
      
      steps.value.push({
        id: '01-knapsack-bb',
        description: `分支2：选物品 ${String.fromCharCode(65 + nextItem.id)}，总重量=${selectNode.weight}，总价值=${selectNode.value}`,
        code: `// 选物品 ${String.fromCharCode(65 + nextItem.id)}`,
        items: items.map((item, idx) => ({
          ...item,
          selected: selectNode.selected.includes(idx)
        })),
        capacity: capacity,
        currentValue: selectNode.value,
        bestValue: bestValue,
        highlightItems: [nextItem.id],
        queueInfo: `选择分支：上界=${selectNode.bound.toFixed(1)}`,
        explanation: '考虑选择当前物品的情况'
      })
      
      if (selectNode.bound > bestValue) {
        queue.push(selectNode)
        steps.value.push({
          id: '01-knapsack-bb',
          description: `将选择分支加入队列`,
          code: `queue.push(selectNode)`,
          items: items.map((item, idx) => ({
            ...item,
            selected: selectNode.selected.includes(idx)
          })),
          capacity: capacity,
          currentValue: selectNode.value,
          bestValue: bestValue,
          highlightItems: [nextItem.id],
          queueInfo: `队列大小: ${queue.length}`,
          explanation: '该分支仍有可能产生更优解，继续探索'
        })
        
        // 更新最佳价值
        if (selectNode.value > bestValue) {
          bestValue = selectNode.value
          bestItems = [...selectNode.selected]
          
          steps.value.push({
            id: '01-knapsack-bb',
            description: `更新最佳价值为 ${bestValue}`,
            code: `bestValue = ${bestValue}`,
            items: items.map((item, idx) => ({
              ...item,
              selected: bestItems.includes(idx)
            })),
            capacity: capacity,
            currentValue: selectNode.value,
            bestValue: bestValue,
            highlightItems: [],
            queueInfo: `最佳价值更新为 ${bestValue}`,
            explanation: '当前选择的物品组合价值高于之前的最优解'
          })
        }
      } else {
        steps.value.push({
          id: '01-knapsack-bb',
          description: `剪枝选择分支：上界 ${selectNode.bound.toFixed(1)} 不超过最佳价值 ${bestValue}`,
          code: '// 剪枝选择分支',
          items: items.map((item, idx) => ({
            ...item,
            selected: selectNode.selected.includes(idx)
          })),
          capacity: capacity,
          currentValue: selectNode.value,
          bestValue: bestValue,
          highlightItems: [nextItem.id],
          queueInfo: `选择分支被剪枝`,
          explanation: '该分支不可能产生更优解，剪枝'
        })
      }
    } else {
      steps.value.push({
        id: '01-knapsack-bb',
        description: `无法选物品 ${String.fromCharCode(65 + nextItem.id)}：超重`,
        code: `// 超重，不能选`,
        items: items.map((item, idx) => ({
          ...item,
          selected: currentNode.selected.includes(idx)
        })),
        capacity: capacity,
        currentValue: currentNode.value,
        bestValue: bestValue,
        highlightItems: [nextItem.id],
        queueInfo: `选择分支超重，跳过`,
        explanation: '当前物品重量加上已选物品重量超过背包容量，无法选择'
      })
    }
  }
  
  steps.value.push({
    id: '01-knapsack-bb',
    description: `分支限界法完成！最优价值=${bestValue}`,
    code: '// 分支限界法完成',
    items: items.map((item, idx) => ({
      ...item,
      selected: bestItems.includes(idx)
    })),
    capacity: capacity,
    currentValue: bestValue,
    bestValue: bestValue,
    highlightItems: [],
    queueInfo: `算法完成！最优价值=${bestValue}`,
    explanation: '遍历完所有可能的分支，找到最优解'
  })
  
  // 添加完整代码示例
  steps.value.push({
    id: '01-knapsack-bb',
    description: '完整代码示例',
    code: `// 分支限界法解决0-1背包问题完整代码
function knapsackBranchAndBound(items, capacity) {
  // 按单位价值排序
  items.sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
  
  let bestValue = 0;
  let bestItems = [];
  const queue = [];
  
  // 计算上界的辅助函数
  function calculateBound(items, capacity, startIndex, currentWeight, currentValue) {
    let bound = currentValue;
    let remainingCapacity = capacity - currentWeight;
    let i = startIndex;
    
    while (i < items.length && items[i].weight <= remainingCapacity) {
      remainingCapacity -= items[i].weight;
      bound += items[i].value;
      i++;
    }
    
    if (i < items.length) {
      bound += (remainingCapacity / items[i].weight) * items[i].value;
    }
    
    return bound;
  }
  
  // 初始化队列：根节点（不选任何物品）
  const rootNode = {
    level: -1,
    weight: 0,
    value: 0,
    bound: calculateBound(items, capacity, 0, 0, 0),
    selected: []
  };
  queue.push(rootNode);
  
  while (queue.length > 0) {
    // 按上界降序排序队列
    queue.sort((a, b) => b.bound - a.bound);
    const currentNode = queue.shift();
    
    // 如果当前节点的上界小于当前最优解，则剪枝
    if (currentNode.bound <= bestValue) {
      continue;
    }
    
    // 如果到达叶子节点
    if (currentNode.level === items.length - 1) {
      if (currentNode.value > bestValue) {
        bestValue = currentNode.value;
        bestItems = [...currentNode.selected];
      }
      continue;
    }
    
    const nextLevel = currentNode.level + 1;
    const nextItem = items[nextLevel];
    
    // 分支1：不选下一个物品
    const notSelectNode = {
      level: nextLevel,
      weight: currentNode.weight,
      value: currentNode.value,
      bound: calculateBound(items, capacity, nextLevel + 1, currentNode.weight, currentNode.value),
      selected: [...currentNode.selected]
    };
    
    if (notSelectNode.bound > bestValue) {
      queue.push(notSelectNode);
    }
    
    // 分支2：选下一个物品（如果能放下）
    if (currentNode.weight + nextItem.weight <= capacity) {
      const selectNode = {
        level: nextLevel,
        weight: currentNode.weight + nextItem.weight,
        value: currentNode.value + nextItem.value,
        bound: calculateBound(items, capacity, nextLevel + 1, currentNode.weight + nextItem.weight, currentNode.value + nextItem.value),
        selected: [...currentNode.selected, nextItem.id]
      };
      
      if (selectNode.bound > bestValue) {
        queue.push(selectNode);
        
        // 更新最佳价值
        if (selectNode.value > bestValue) {
          bestValue = selectNode.value;
          bestItems = [...selectNode.selected];
        }
      }
    }
  }
  
  return { bestValue, bestItems };
}

// 示例调用
const items = [
  { id: 0, weight: 2, value: 10 },
  { id: 1, weight: 3, value: 15 },
  { id: 2, weight: 5, value: 20 },
  { id: 3, weight: 7, value: 25 },
  { id: 4, weight: 1, value: 5 }
];
const capacity = 10;

const result = knapsackBranchAndBound(items, capacity);
console.log('最优价值:', result.bestValue); // 输出: 50
console.log('选中的物品ID:', result.bestItems);`,
    items: items.map((item, idx) => ({
      ...item,
      selected: bestItems.includes(idx)
    })),
    capacity: capacity,
    currentValue: bestValue,
    bestValue: bestValue,
    highlightItems: [],
    queueInfo: `算法完成！最优价值=${bestValue}`
  })
}

// 生成随机树
const generateRandomTree = () => {
  // 生成一个简单的二叉树
  tree.value = {
    nodes: [
      { id: 0, value: 10, left: 1, right: 2, parent: null, x: 400, y: 50, visited: false },
      { id: 1, value: 5, left: 3, right: 4, parent: 0, x: 200, y: 150, visited: false },
      { id: 2, value: 15, left: 5, right: 6, parent: 0, x: 600, y: 150, visited: false },
      { id: 3, value: 3, left: null, right: null, parent: 1, x: 100, y: 250, visited: false },
      { id: 4, value: 7, left: null, right: null, parent: 1, x: 300, y: 250, visited: false },
      { id: 5, value: 12, left: null, right: null, parent: 2, x: 500, y: 250, visited: false },
      { id: 6, value: 20, left: null, right: null, parent: 2, x: 700, y: 250, visited: false }
    ],
    root: 0
  }
  displayTree.value = JSON.parse(JSON.stringify(tree.value))
  console.log('[Algorithm] Generated tree:', tree.value)
}

// 获取树节点的父节点
const getTreeParentNode = (parentId) => {
  const step = steps.value[currentStep.value]
  if (step && step.tree) {
    return step.tree.nodes.find(node => node.id === parentId)
  }
  return null
}

// 生树遍历步骤
const generateTreeTraversalSteps = (traversalType) => {
  const treeData = JSON.parse(JSON.stringify(tree.value))
  steps.value = []
  const result = []
  
  steps.value.push({
    description: `开始${getTraversalName(traversalType)}遍历`,
    code: `${traversalType}Traversal(root)`,
    tree: treeData,
    result: [],
    highlightNode: treeData.root
  })
  
  switch (traversalType) {
    case 'preorder':
      preorderTraversal(treeData, treeData.root, result)
      break
    case 'inorder':
      inorderTraversal(treeData, treeData.root, result)
      break
    case 'postorder':
      postorderTraversal(treeData, treeData.root, result)
      break
  }
  
  steps.value.push({
    description: `${getTraversalName(traversalType)}遍历完成！`,
    code: '// 遍历完成',
    tree: treeData,
    result: result,
    highlightNode: null
  })
  
  // 添加完整代码示例
  steps.value.push({
    description: '完整代码示例',
    code: `// 树遍历完整代码

// 前序遍历（根-左-右）
function preorderTraversal(node) {
  if (!node) return [];
  const result = [];
  result.push(node.value);
  result.push(...preorderTraversal(node.left));
  result.push(...preorderTraversal(node.right));
  return result;
}

// 中序遍历（左-根-右）
function inorderTraversal(node) {
  if (!node) return [];
  const result = [];
  result.push(...inorderTraversal(node.left));
  result.push(node.value);
  result.push(...inorderTraversal(node.right));
  return result;
}

// 后序遍历（左-右-根）
function postorderTraversal(node) {
  if (!node) return [];
  const result = [];
  result.push(...postorderTraversal(node.left));
  result.push(...postorderTraversal(node.right));
  result.push(node.value);
  return result;
}

// 示例调用
const tree = {
  value: 10,
  left: {
    value: 5,
    left: { value: 3 },
    right: { value: 7 }
  },
  right: {
    value: 15,
    left: { value: 12 },
    right: { value: 20 }
  }
};

console.log('前序遍历:', preorderTraversal(tree)); // 输出: [10, 5, 3, 7, 15, 12, 20]
console.log('中序遍历:', inorderTraversal(tree)); // 输出: [3, 5, 7, 10, 12, 15, 20]
console.log('后序遍历:', postorderTraversal(tree)); // 输出: [3, 7, 5, 12, 20, 15, 10]`,
    tree: treeData,
    result: result,
    highlightNode: null
  })
}

// 前序遍历
const preorderTraversal = (treeData, nodeId, result) => {
  const node = treeData.nodes.find(n => n.id === nodeId)
  if (!node) return
  
  // 访问节点
  node.visited = true
  result.push(node.value)
  steps.value.push({
    description: `访问节点 ${node.value}`,
    code: `console.log(${node.value})`,
    tree: JSON.parse(JSON.stringify(treeData)),
    result: [...result],
    highlightNode: node.id
  })
  
  // 遍历左子树
  if (node.left !== null) {
    steps.value.push({
      description: `进入左子树 ${treeData.nodes.find(n => n.id === node.left).value}`,
      code: `preorderTraversal(node.left)`,
      tree: JSON.parse(JSON.stringify(treeData)),
      result: [...result],
      highlightNode: node.left
    })
    preorderTraversal(treeData, node.left, result)
  }
  
  // 遍历右子树
  if (node.right !== null) {
    steps.value.push({
      description: `进入右子树 ${treeData.nodes.find(n => n.id === node.right).value}`,
      code: `preorderTraversal(node.right)`,
      tree: JSON.parse(JSON.stringify(treeData)),
      result: [...result],
      highlightNode: node.right
    })
    preorderTraversal(treeData, node.right, result)
  }
}

// 中序遍历
const inorderTraversal = (treeData, nodeId, result) => {
  const node = treeData.nodes.find(n => n.id === nodeId)
  if (!node) return
  
  // 遍历左子树
  if (node.left !== null) {
    steps.value.push({
      description: `进入左子树 ${treeData.nodes.find(n => n.id === node.left).value}`,
      code: `inorderTraversal(node.left)`,
      tree: JSON.parse(JSON.stringify(treeData)),
      result: [...result],
      highlightNode: node.left
    })
    inorderTraversal(treeData, node.left, result)
  }
  
  // 访问节点
  node.visited = true
  result.push(node.value)
  steps.value.push({
    description: `访问节点 ${node.value}`,
    code: `console.log(${node.value})`,
    tree: JSON.parse(JSON.stringify(treeData)),
    result: [...result],
    highlightNode: node.id
  })
  
  // 遍历右子树
  if (node.right !== null) {
    steps.value.push({
      description: `进入右子树 ${treeData.nodes.find(n => n.id === node.right).value}`,
      code: `inorderTraversal(node.right)`,
      tree: JSON.parse(JSON.stringify(treeData)),
      result: [...result],
      highlightNode: node.right
    })
    inorderTraversal(treeData, node.right, result)
  }
}

// 后序遍历
const postorderTraversal = (treeData, nodeId, result) => {
  const node = treeData.nodes.find(n => n.id === nodeId)
  if (!node) return
  
  // 遍历左子树
  if (node.left !== null) {
    steps.value.push({
      description: `进入左子树 ${treeData.nodes.find(n => n.id === node.left).value}`,
      code: `postorderTraversal(node.left)`,
      tree: JSON.parse(JSON.stringify(treeData)),
      result: [...result],
      highlightNode: node.left
    })
    postorderTraversal(treeData, node.left, result)
  }
  
  // 遍历右子树
  if (node.right !== null) {
    steps.value.push({
      description: `进入右子树 ${treeData.nodes.find(n => n.id === node.right).value}`,
      code: `postorderTraversal(node.right)`,
      tree: JSON.parse(JSON.stringify(treeData)),
      result: [...result],
      highlightNode: node.right
    })
    postorderTraversal(treeData, node.right, result)
  }
  
  // 访问节点
  node.visited = true
  result.push(node.value)
  steps.value.push({
    description: `访问节点 ${node.value}`,
    code: `console.log(${node.value})`,
    tree: JSON.parse(JSON.stringify(treeData)),
    result: [...result],
    highlightNode: node.id
  })
}

// 获取遍历名称
const getTraversalName = (type) => {
  switch (type) {
    case 'preorder': return '前序'
    case 'inorder': return '中序'
    case 'postorder': return '后序'
    default: return ''
  }
}

// 将节点ID数组转换为节点标签数组
const formatNodeLabels = (nodeIds) => {
  return nodeIds.map(id => {
    const node = displayGraph.value.nodes.find(n => n.id === id)
    return node ? node.label : id
  })
}

// 生成 BFS 步骤
const generateBfsSteps = () => {
  const graphData = JSON.parse(JSON.stringify(graph.value))
  steps.value = []
  const visited = new Set()
  const queue = []
  const startNodeId = 0
  const startNode = graphData.nodes.find(n => n.id === startNodeId)
  
  // 初始化步骤
  steps.value.push({
    description: `初始化 BFS，从节点 ${startNode.label} 开始`,
    code: `queue = []; visited = new Set();\nqueue.push(${startNodeId});\nvisited.add(${startNodeId});`,
    graph: JSON.parse(JSON.stringify(graphData)),
    highlightNodes: [startNodeId],
    highlightEdges: [],
    queue: [startNodeId],
    visited: [startNodeId]
  })
  
  queue.push(startNodeId)
  visited.add(startNodeId)
  
  while (queue.length > 0) {
    const currentNodeId = queue.shift()
    const currentNode = graphData.nodes.find(n => n.id === currentNodeId)
    
    // 访问节点步骤
    steps.value.push({
      description: `从队列中取出并访问节点 ${currentNode.label}`,
      code: `currentNode = queue.shift(); // 取出队首节点\nconsole.log('访问节点', ${currentNode.label});`,
      graph: JSON.parse(JSON.stringify(graphData)),
      highlightNodes: [currentNodeId],
      highlightEdges: [],
      queue: [...queue],
      visited: [...visited]
    })
    
    // 标记当前节点为已访问
    currentNode.visited = true
    
    // 获取当前节点的邻居
    const neighbors = graphData.edges
      .filter(edge => edge.from === currentNodeId || edge.to === currentNodeId)
      .map(edge => edge.from === currentNodeId ? edge.to : edge.from)
      .filter(neighborId => !visited.has(neighborId))
    
    if (neighbors.length > 0) {
      steps.value.push({
        description: `查找节点 ${currentNode.label} 的未访问邻居`,
        code: `neighbors = getUnvisitedNeighbors(${currentNodeId});`,
        graph: JSON.parse(JSON.stringify(graphData)),
        highlightNodes: [currentNodeId, ...neighbors],
        highlightEdges: neighbors.map(neighborId => ({ from: currentNodeId, to: neighborId })),
        queue: [...queue],
        visited: [...visited]
      })
      
      for (const neighborId of neighbors) {
        const neighborNode = graphData.nodes.find(n => n.id === neighborId)
        
        steps.value.push({
          description: `将节点 ${neighborNode.label} 加入队列`,
          code: `queue.push(${neighborId});\nvisited.add(${neighborId});`,
          graph: JSON.parse(JSON.stringify(graphData)),
          highlightNodes: [neighborId],
          highlightEdges: [{ from: currentNodeId, to: neighborId }],
          queue: [...queue, neighborId],
          visited: [...visited, neighborId]
        })
        
        queue.push(neighborId)
        visited.add(neighborId)
      }
    } else {
      steps.value.push({
        description: `节点 ${currentNode.label} 没有未访问的邻居`,
        code: `// 无未访问邻居`,
        graph: JSON.parse(JSON.stringify(graphData)),
        highlightNodes: [currentNodeId],
        highlightEdges: [],
        queue: [...queue],
        visited: [...visited]
      })
    }
  }
  
  steps.value.push({
    description: 'BFS 遍历完成！',
    code: '// BFS 遍历完成',
    graph: JSON.parse(JSON.stringify(graphData)),
    highlightNodes: [],
    highlightEdges: [],
    queue: [],
    visited: [...visited]
  })
  
  // 添加完整代码示例
  steps.value.push({
    description: '完整代码示例',
    code: `// BFS算法完整代码
function bfs(graph, start) {
  const visited = new Set();
  const queue = [];
  const result = [];
  
  queue.push(start);
  visited.add(start);
  
  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current);
    
    // 遍历当前节点的所有邻居
    for (const neighbor of graph[current]) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
        visited.add(neighbor);
      }
    }
  }
  
  return result;
}

// 示例调用
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

console.log('BFS遍历结果:', bfs(graph, 'A')); // 输出: ['A', 'B', 'C', 'D', 'E', 'F']`,
    graph: JSON.parse(JSON.stringify(graphData)),
    highlightNodes: [],
    highlightEdges: [],
    queue: [],
    visited: [...visited]
  })
}

// 生成 DFS 步骤
const generateDfsSteps = () => {
  const graphData = JSON.parse(JSON.stringify(graph.value))
  steps.value = []
  const visited = new Set()
  const stack = []
  const startNodeId = 0
  const startNode = graphData.nodes.find(n => n.id === startNodeId)
  
  // 初始化步骤
  steps.value.push({
    description: `初始化 DFS，从节点 ${startNode.label} 开始`,
    code: `stack = []; visited = new Set();\nstack.push(${startNodeId});`,
    graph: JSON.parse(JSON.stringify(graphData)),
    highlightNodes: [startNodeId],
    highlightEdges: [],
    stack: [startNodeId],
    visited: []
  })
  
  stack.push(startNodeId)
  
  while (stack.length > 0) {
    const currentNodeId = stack.pop()
    const currentNode = graphData.nodes.find(n => n.id === currentNodeId)
    
    if (!visited.has(currentNodeId)) {
      steps.value.push({
        description: `从栈中弹出并访问节点 ${currentNode.label}`,
        code: `currentNode = stack.pop(); // 弹出栈顶节点\nif (!visited.has(currentNode)) {\n  console.log('访问节点', ${currentNode.label});`,
        graph: JSON.parse(JSON.stringify(graphData)),
        highlightNodes: [currentNodeId],
        highlightEdges: [],
        stack: [...stack],
        visited: [...visited]
      })
      
      visited.add(currentNodeId)
      currentNode.visited = true
      
      // 获取当前节点的邻居（逆序以保持与 BFS 相同的访问顺序）
      const neighbors = graphData.edges
        .filter(edge => edge.from === currentNodeId || edge.to === currentNodeId)
        .map(edge => edge.from === currentNodeId ? edge.to : edge.from)
        .filter(neighborId => !visited.has(neighborId))
        .reverse()
      
      if (neighbors.length > 0) {
        steps.value.push({
          description: `查找节点 ${currentNode.label} 的未访问邻居`,
          code: `neighbors = getUnvisitedNeighbors(${currentNodeId});`,
          graph: JSON.parse(JSON.stringify(graphData)),
          highlightNodes: [currentNodeId, ...neighbors],
          highlightEdges: neighbors.map(neighborId => ({ from: currentNodeId, to: neighborId })),
          stack: [...stack],
          visited: [...visited]
        })
        
        for (const neighborId of neighbors) {
          const neighborNode = graphData.nodes.find(n => n.id === neighborId)
          
          steps.value.push({
            description: `将节点 ${neighborNode.label} 压入栈`,
            code: `stack.push(${neighborId});`,
            graph: JSON.parse(JSON.stringify(graphData)),
            highlightNodes: [neighborId],
            highlightEdges: [{ from: currentNodeId, to: neighborId }],
            stack: [...stack, neighborId],
            visited: [...visited]
          })
          
          stack.push(neighborId)
        }
      } else {
        steps.value.push({
          description: `节点 ${currentNode.label} 没有未访问的邻居`,
          code: `// 无未访问邻居`,
          graph: JSON.parse(JSON.stringify(graphData)),
          highlightNodes: [currentNodeId],
          highlightEdges: [],
          stack: [...stack],
          visited: [...visited]
        })
      }
    } else {
      steps.value.push({
        description: `节点 ${currentNode.label} 已访问，跳过`,
        code: `} else {\n  // 节点已访问，跳过\n}`,
        graph: JSON.parse(JSON.stringify(graphData)),
        highlightNodes: [currentNodeId],
        highlightEdges: [],
        stack: [...stack],
        visited: [...visited]
      })
    }
  }
  
  steps.value.push({
    description: 'DFS 遍历完成！',
    code: '// DFS 遍历完成',
    graph: JSON.parse(JSON.stringify(graphData)),
    highlightNodes: [],
    highlightEdges: [],
    stack: [],
    visited: [...visited]
  })
  
  // 添加完整代码示例
  steps.value.push({
    description: '完整代码示例',
    code: `// DFS算法完整代码（迭代版本）
function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [];
  const result = [];
  
  stack.push(start);
  
  while (stack.length > 0) {
    const current = stack.pop();
    
    if (!visited.has(current)) {
      visited.add(current);
      result.push(current);
      
      // 逆序压入邻居，保证访问顺序与BFS一致
      for (const neighbor of graph[current].reverse()) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }
  
  return result;
}

// DFS算法完整代码（递归版本）
function dfsRecursive(graph, start, visited = new Set(), result = []) {
  visited.add(start);
  result.push(start);
  
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfsRecursive(graph, neighbor, visited, result);
    }
  }
  
  return result;
}

// 示例调用
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

console.log('DFS迭代版本结果:', dfsIterative(graph, 'A')); // 输出: ['A', 'B', 'D', 'E', 'F', 'C']
console.log('DFS递归版本结果:', dfsRecursive(graph, 'A')); // 输出: ['A', 'B', 'D', 'E', 'F', 'C']`,
    graph: JSON.parse(JSON.stringify(graphData)),
    highlightNodes: [],
    highlightEdges: [],
    stack: [],
    visited: [...visited]
  })
}

const generateBubbleSortSteps = () => {
  const arr = [...array.value]
  steps.value = []
  
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      steps.value.push({
        description: `比较 ${arr[j]} 和 ${arr[j + 1]}`,
        code: `if (${arr[j]} > ${arr[j + 1]})`,
        array: [...arr],
        highlight: [j, j + 1],
        sorted: i
      })
      
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        steps.value.push({
          description: `交换 ${arr[j]} 和 ${arr[j + 1]}`,
          code: `swap(${j}, ${j + 1})`,
          array: [...arr],
          highlight: [j, j + 1],
          sorted: i
        })
      }
    }
    steps.value.push({
      description: `第 ${i + 1} 轮完成`,
      code: `// 第 ${i + 1} 轮`,
      array: [...arr],
      highlight: [],
      sorted: i + 1
    })
  }
  steps.value.push({
    description: '排序完成！',
    code: '// 完成',
    array: [...arr],
    highlight: [],
    sorted: arr.length
  })
  
  // 添加完整代码示例
  steps.value.push({
    description: '完整代码示例',
    code: `// 冒泡排序完整代码
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

// 示例调用
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort(array)); // 输出: [11, 12, 22, 25, 34, 64, 90]`,
    array: [...arr],
    highlight: [],
    sorted: arr.length
  })
}

const generateQuickSortSteps = () => {
  const arr = [...array.value]
  steps.value = []
  
  const quickSort = (low, high) => {
    if (low < high) {
      const pivot = arr[high]
      let i = low - 1
      
      steps.value.push({
        description: `分区 [${low}, ${high}], 基准: ${pivot}`,
        code: `pivot = ${pivot}`,
        array: [...arr],
        highlight: [high],
        sorted: 0
      })
      
      for (let j = low; j < high; j++) {
        steps.value.push({
          description: `比较 ${arr[j]} 和 ${pivot}`,
          code: `${arr[j]} <= ${pivot}`,
          array: [...arr],
          highlight: [j, high],
          sorted: 0
        })
        
        if (arr[j] <= pivot) {
          i++
          if (i !== j) {
            [arr[i], arr[j]] = [arr[j], arr[i]]
            steps.value.push({
              description: `交换 ${arr[i]} 和 ${arr[j]}`,
              code: `swap(${i}, ${j})`,
              array: [...arr],
              highlight: [i, j],
              sorted: 0
            })
          }
        }
      }
      
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
      const pi = i + 1
      
      steps.value.push({
        description: `基准就位: ${pi}`,
        code: `pivot at ${pi}`,
        array: [...arr],
        highlight: [pi],
        sorted: 0
      })
      
      quickSort(low, pi - 1)
      quickSort(pi + 1, high)
    }
  }
  
  quickSort(0, arr.length - 1)
  
  steps.value.push({
    description: '排序完成！',
    code: '// 完成',
    array: [...arr],
    highlight: [],
    sorted: arr.length
  })
  
  // 添加完整代码示例
  steps.value.push({
    description: '完整代码示例',
    code: `// 快速排序完整代码
function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// 示例调用
const array = [64, 34, 25, 12, 22, 11, 90];
console.log(quickSort(array)); // 输出: [11, 12, 22, 25, 34, 64, 90]`,
    array: [...arr],
    highlight: [],
    sorted: arr.length
  })
}

const generateBinarySearchSteps = () => {
  const sortedArr = [...array.value].sort((a, b) => a - b)
  const target = sortedArr[Math.floor(Math.random() * sortedArr.length)]
  
  steps.value = []
  
  let left = 0
  let right = sortedArr.length - 1
  
  steps.value.push({
    description: `初始化，查找目标: ${target}`,
    code: `left = 0; right = ${sortedArr.length - 1}; target = ${target};`,
    array: [...sortedArr],
    highlight: [left, right],
    sorted: sortedArr.length
  })
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    
    steps.value.push({
      description: `计算中间位置: ${mid}`,
      code: `mid = Math.floor((${left} + ${right}) / 2);`,
      array: [...sortedArr],
      highlight: [mid],
      sorted: sortedArr.length
    })
    
    steps.value.push({
      description: `比较 ${sortedArr[mid]} 和 ${target}`,
      code: `if (${sortedArr[mid]} === ${target}) {`,
      array: [...sortedArr],
      highlight: [mid],
      sorted: sortedArr.length
    })
    
    if (sortedArr[mid] === target) {
      steps.value.push({
        description: `找到目标！位置: ${mid}`,
        code: `return ${mid}; // 找到目标`,
        array: [...sortedArr],
        highlight: [mid],
        sorted: sortedArr.length
      })
      break
    } else if (sortedArr[mid] > target) {
      right = mid - 1
      steps.value.push({
        description: `目标在左半部分，右边界: ${right}`,
        code: `right = ${mid} - 1;`,
        array: [...sortedArr],
        highlight: [left, right],
        sorted: sortedArr.length
      })
    } else {
      left = mid + 1
      steps.value.push({
        description: `目标在右半部分，左边界: ${left}`,
        code: `left = ${mid} + 1;`,
        array: [...sortedArr],
        highlight: [left, right],
        sorted: sortedArr.length
      })
    }
  }
  
  if (left > right) {
    steps.value.push({
      description: '未找到目标',
      code: `return -1; // 未找到`,
      array: [...sortedArr],
      highlight: [],
      sorted: sortedArr.length
    })
  }
  
  // 添加完整代码示例
  steps.value.push({
    description: '完整代码示例',
    code: `// 二分查找完整代码
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // 找到目标
    } else if (arr[mid] > target) {
      right = mid - 1; // 目标在左半部分
    } else {
      left = mid + 1; // 目标在右半部分
    }
  }
  
  return -1; // 未找到目标
}

// 示例调用
const sortedArray = [11, 12, 22, 25, 34, 64, 90];
const target = 25;
console.log(binarySearch(sortedArray, target)); // 输出: 3
console.log(binarySearch(sortedArray, 100)); // 输出: -1`,
    array: [...sortedArr],
    highlight: [],
    sorted: sortedArr.length
  })
}

const generateRandomGraph = () => {
  const nodeCount = 6
  const nodes = []
  const edges = []
  
  for (let i = 0; i < nodeCount; i++) {
    const angle = (2 * Math.PI * i) / nodeCount
    const x = 200 + 150 * Math.cos(angle - Math.PI / 2)
    const y = 200 + 150 * Math.sin(angle - Math.PI / 2)
    nodes.push({
      id: i,
      label: String.fromCharCode(65 + i),
      x,
      y,
      distance: i === 0 ? 0 : Infinity,
      visited: false,
      previous: null
    })
  }
  
  const existingEdges = new Set()
  for (let i = 0; i < nodeCount; i++) {
    if (i < nodeCount - 1) {
      const weight = Math.floor(Math.random() * 10) + 1
      edges.push({ from: i, to: i + 1, weight })
      existingEdges.add(`${i}-${i + 1}`)
      existingEdges.add(`${i + 1}-${i}`)
    }
  }
  
  const additionalEdges = Math.floor(Math.random() * 4) + 3
  for (let i = 0; i < additionalEdges; i++) {
    let from, to
    do {
      from = Math.floor(Math.random() * nodeCount)
      to = Math.floor(Math.random() * nodeCount)
    } while (from === to || existingEdges.has(`${from}-${to}`))
    
    const weight = Math.floor(Math.random() * 10) + 1
    edges.push({ from, to, weight })
    existingEdges.add(`${from}-${to}`)
    existingEdges.add(`${to}-${from}`)
  }
  
  graph.value = { nodes, edges }
  displayGraph.value = JSON.parse(JSON.stringify(graph.value))
  startNode.value = 0
  console.log('[Algorithm] Generated graph:', graph.value)
}

const generateDijkstraSteps = () => {
  const nodes = JSON.parse(JSON.stringify(graph.value.nodes))
  const edges = [...graph.value.edges]
  steps.value = []
  
  const adjacency = new Map()
  nodes.forEach(node => {
    adjacency.set(node.id, [])
  })
  edges.forEach(edge => {
    adjacency.get(edge.from).push({ node: edge.to, weight: edge.weight })
    adjacency.get(edge.to).push({ node: edge.from, weight: edge.weight })
  })
  
  const distances = new Map()
  const previous = new Map()
  const visited = new Set()
  const unvisited = new Set()
  
  nodes.forEach(node => {
    distances.set(node.id, node.id === startNode.value ? 0 : Infinity)
    previous.set(node.id, null)
    unvisited.add(node.id)
  })
  
  steps.value.push({
    description: `初始化，从节点 ${nodes[startNode.value].label} 开始`,
    code: `distances = [0, ∞, ∞, ...];`,
    graph: { nodes: JSON.parse(JSON.stringify(nodes)), edges },
    highlightNodes: [startNode.value],
    highlightEdges: []
  })
  
  while (unvisited.size > 0) {
    let minDist = Infinity
    let current = -1
    unvisited.forEach(nodeId => {
      if (distances.get(nodeId) < minDist) {
        minDist = distances.get(nodeId)
        current = nodeId
      }
    })
    
    if (current === -1 || minDist === Infinity) break
    
    steps.value.push({
      description: `选择节点 ${nodes[current].label}，距离: ${minDist}`,
      code: `current = ${nodes[current].label}; distance = ${minDist};`,
      graph: { 
        nodes: nodes.map(n => ({
          ...n,
          distance: distances.get(n.id),
          visited: visited.has(n.id),
          previous: previous.get(n.id)
        })), 
        edges 
      },
      highlightNodes: [current],
      highlightEdges: []
    })
    
    visited.add(current)
    unvisited.delete(current)
    
    const neighbors = adjacency.get(current)
    for (const neighbor of neighbors) {
      if (visited.has(neighbor.node)) continue
      
      const newDist = distances.get(current) + neighbor.weight
      
      steps.value.push({
        description: `检查边 ${nodes[current].label} → ${nodes[neighbor.node].label}，权重: ${neighbor.weight}`,
        code: `newDist = ${distances.get(current)} + ${neighbor.weight} = ${newDist};`,
        graph: { 
          nodes: nodes.map(n => ({
            ...n,
            distance: distances.get(n.id),
            visited: visited.has(n.id),
            previous: previous.get(n.id)
          })), 
          edges 
        },
        highlightNodes: [current, neighbor.node],
        highlightEdges: [{ from: current, to: neighbor.node }]
      })
      
      if (newDist < distances.get(neighbor.node)) {
        distances.set(neighbor.node, newDist)
        previous.set(neighbor.node, current)
        
        steps.value.push({
          description: `更新节点 ${nodes[neighbor.node].label} 的距离为 ${newDist}`,
          code: `distances[${nodes[neighbor.node].label}] = ${newDist};`,
          graph: { 
            nodes: nodes.map(n => ({
              ...n,
              distance: distances.get(n.id),
              visited: visited.has(n.id),
              previous: previous.get(n.id)
            })), 
            edges 
          },
          highlightNodes: [neighbor.node],
          highlightEdges: []
        })
      }
    }
  }
  
  steps.value.push({
    description: 'Dijkstra算法完成！',
    code: '// 最短路径计算完成',
    graph: { 
      nodes: nodes.map(n => ({
        ...n,
        distance: distances.get(n.id),
        visited: visited.has(n.id),
        previous: previous.get(n.id)
      })), 
      edges 
    },
    highlightNodes: [],
    highlightEdges: []
  })
  
  // 添加完整代码示例
  steps.value.push({
    description: '完整代码示例',
    code: `// Dijkstra算法完整代码
function dijkstra(graph, start) {
  const distances = {};
  const previous = {};
  const unvisited = new Set();
  
  // 初始化距离
  for (const node in graph) {
    distances[node] = node === start ? 0 : Infinity;
    previous[node] = null;
    unvisited.add(node);
  }
  
  while (unvisited.size > 0) {
    // 找到距离最小的节点
    let minNode = null;
    let minDistance = Infinity;
    
    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        minNode = node;
      }
    }
    
    if (minNode === null) break;
    
    unvisited.delete(minNode);
    
    // 更新邻居节点的距离
    for (const neighbor in graph[minNode]) {
      const weight = graph[minNode][neighbor];
      const newDistance = distances[minNode] + weight;
      
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance;
        previous[neighbor] = minNode;
      }
    }
  }
  
  return { distances, previous };
}

// 示例调用
const graph = {
  A: { B: 2, C: 4 },
  B: { A: 2, C: 1, D: 7 },
  C: { A: 4, B: 1, D: 3 },
  D: { B: 7, C: 3 }
};

const result = dijkstra(graph, 'A');
console.log('最短距离:', result.distances);
console.log('前驱节点:', result.previous);`,
    graph: { 
      nodes: nodes.map(n => ({
        ...n,
        distance: distances.get(n.id),
        visited: visited.has(n.id),
        previous: previous.get(n.id)
      })), 
      edges 
    },
    highlightNodes: [],
    highlightEdges: []
  })
}

const startDemo = () => {
  console.log('[Algorithm] Start demo')
  if (steps.value.length === 0) {
    generateSteps()
  }
  currentStep.value = 0
  updateCurrentStep()
  isPlaying.value = true
  playSteps()
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  console.log('[Algorithm] Toggle play:', isPlaying.value)
  if (isPlaying.value) {
    playSteps()
  } else if (playTimer) {
    clearTimeout(playTimer)
  }
}

const playSteps = () => {
  if (!isPlaying.value || currentStep.value >= steps.value.length - 1) {
    isPlaying.value = false
    return
  }
  
  playTimer = setTimeout(() => {
    nextStep()
    playSteps()
  }, speedDelay.value)
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
    updateCurrentStep()
  }
}

const nextStep = () => {
  if (currentStep.value < steps.value.length - 1) {
    currentStep.value++
    updateCurrentStep()
  }
}

const updateCurrentStep = () => {
  const step = steps.value[currentStep.value]
  if (step) {
    currentStepCode.value = step.code
    if (step.graph) {
      displayGraph.value = JSON.parse(JSON.stringify(step.graph))
      highlightedIndices.value = step.highlightNodes || []
    } else if (step.items && currentAlgorithm.value.id === 'fractional-knapsack') {
      displayKnapsackItems.value = JSON.parse(JSON.stringify(step.items))
    } else if (step.items && currentAlgorithm.value.id === '01-knapsack-bb') {
      displayBbKnapsackItems.value = JSON.parse(JSON.stringify(step.items))
    } else if (step.activities) {
      displayActivities.value = JSON.parse(JSON.stringify(step.activities))
    } else if (step.tree) {
      displayTree.value = JSON.parse(JSON.stringify(step.tree))
      highlightedIndices.value = step.highlightNode ? [step.highlightNode] : []
    } else if (step.id === 'fibonacci' || step.id === 'lcs' || step.id === '01-knapsack-bb') {
      // 动态规划和分支限界法数据更新由可视化组件直接使用 steps[currentStep]
    } else {
      displayArray.value = [...step.array]
      highlightedIndices.value = step.highlight || []
    }
    
    // 自动滚动到当前步骤
    nextTick(() => {
      const currentStepElement = stepElements.value[currentStep.value]
      if (currentStepElement && stepsContainer.value) {
        currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    })
    
    console.log('[Algorithm] Step updated:', currentStep.value, step)
  }
}

const resetDemo = () => {
  isPlaying.value = false
  if (playTimer) {
    clearTimeout(playTimer)
  }
  currentStep.value = 0
  if (currentAlgorithm.value.type === 'graph') {
    displayGraph.value = JSON.parse(JSON.stringify(graph.value))
  } else if (currentAlgorithm.value.id === 'fractional-knapsack') {
    displayKnapsackItems.value = JSON.parse(JSON.stringify(knapsackItems.value))
  } else if (currentAlgorithm.value.id === 'activity-selection') {
    displayActivities.value = JSON.parse(JSON.stringify(activities.value))
  } else if (currentAlgorithm.value.type === 'tree') {
    displayTree.value = JSON.parse(JSON.stringify(tree.value))
  } else if (currentAlgorithm.value.type === 'dp' || currentAlgorithm.value.type === 'bb') {
    // 动态规划和分支限界法不需要重置
  } else {
    displayArray.value = [...array.value]
  }
  highlightedIndices.value = []
  sortedIndices.value = []
  updateCurrentStep()
}

watch(() => params.value.arraySize, () => {
  generateRandomArray()
  generateSteps()
})

watch(() => fibonacciNumber.value, () => {
  if (currentAlgorithm.value.id === 'fibonacci') {
    generateSteps()
  }
})

watch(() => [lcsString1.value, lcsString2.value], () => {
  if (currentAlgorithm.value.id === 'lcs') {
    generateSteps()
  }
})

watch(() => bbKnapsackCapacity.value, () => {
  if (currentAlgorithm.value.id === '01-knapsack-bb') {
    generateSteps()
  }
})

onMounted(() => {
  console.log('[Algorithm] Mounted')
  if (currentAlgorithm.value.type === 'graph') {
    generateRandomGraph()
  } else if (currentAlgorithm.value.type === 'greedy') {
    if (currentAlgorithm.value.id === 'fractional-knapsack') {
      generateRandomKnapsackItems()
    } else if (currentAlgorithm.value.id === 'activity-selection') {
      generateRandomActivities()
    }
  } else if (currentAlgorithm.value.type === 'dp') {
    // 动态规划算法不需要额外初始化
  } else if (currentAlgorithm.value.type === 'bb') {
    if (currentAlgorithm.value.id === '01-knapsack-bb') {
      generateRandomBbKnapsackItems()
    }
  } else if (currentAlgorithm.value.type === 'tree') {
    generateRandomTree()
  } else {
    generateRandomArray()
  }
  generateSteps()
  console.log('[Algorithm] Initialization complete')
})
</script>

<style scoped>
.visualization-container {
  border: 2px solid #e5e7eb;
  overflow: hidden;
}

.bars-container {
  align-items: flex-end;
  padding: 20px 10px;
  min-width: 100%;
}

.bar-item {
  position: relative;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.bar-value {
  position: absolute;
  white-space: nowrap;
  z-index: 10;
}

.debug-info {
  background-color: #fef3c7;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #fcd34d;
}

.graph-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.graph-container svg {
  max-width: 100%;
  max-height: 100%;
}

.graph-container line {
  transition: stroke 0.3s ease;
}

.graph-container circle {
  transition: fill 0.3s ease, stroke 0.3s ease;
  cursor: pointer;
}

.graph-container circle:hover {
  filter: brightness(1.1);
}
</style>