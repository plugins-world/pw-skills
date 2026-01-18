# 图像风格库

## 使用说明

这个文件包含预设的图像风格选项,Agent 可以根据用户需求自动推荐或让用户手动选择。

## 风格列表

### 1. 水彩风格 (watercolor)

**适用场景**: 柔和、温馨的主题,儿童插画,情感表达

**风格特征**:
- 柔和的色彩过渡
- 半透明的颜色叠加
- 纸张纹理感
- 边缘模糊自然

**提示词关键词**: watercolor painting, soft colors, gentle transitions, paper texture

---

### 2. 扁平化设计 (flat-design)

**适用场景**: 现代科技、UI 设计、信息图表、商业演示

**风格特征**:
- 简洁的几何形状
- 纯色填充,无渐变
- 清晰的轮廓线
- 极简主义

**提示词关键词**: flat design, minimalist, geometric shapes, solid colors, clean lines

---

### 3. 3D 渲染 (3d-render)

**适用场景**: 产品展示、建筑可视化、游戏资产

**风格特征**:
- 立体感强
- 光影效果明显
- 材质质感真实
- 高清细节

**提示词关键词**: 3D render, volumetric lighting, realistic materials, high detail, octane render

---

### 4. 油画风格 (oil-painting)

**适用场景**: 艺术作品、肖像画、风景画

**风格特征**:
- 厚重的笔触
- 丰富的色彩层次
- 强烈的质感
- 经典艺术感

**提示词关键词**: oil painting, thick brushstrokes, rich colors, classical art style

---

### 5. 赛博朋克 (cyberpunk)

**适用场景**: 科幻主题、未来城市、游戏场景

**风格特征**:
- 霓虹灯光效果
- 暗色调背景
- 高科技元素
- 城市夜景

**提示词关键词**: cyberpunk, neon lights, dark atmosphere, futuristic city, high-tech

---

### 6. 像素艺术 (pixel-art)

**适用场景**: 复古游戏、怀旧主题、简约图标

**风格特征**:
- 像素化的图形
- 有限的色板
- 清晰的边缘
- 8-bit/16-bit 风格

**提示词关键词**: pixel art, 8-bit style, retro gaming, limited color palette

---

### 7. 手绘插画 (hand-drawn)

**适用场景**: 儿童读物、漫画、创意表达

**风格特征**:
- 手绘线条感
- 不完美的边缘
- 温暖的色调
- 个性化表达

**提示词关键词**: hand-drawn illustration, sketch style, warm colors, personal touch

---

### 8. 照片写实 (photorealistic)

**适用场景**: 产品摄影、人物肖像、真实场景

**风格特征**:
- 极高的真实度
- 精确的光影
- 细腻的纹理
- 摄影级质量

**提示词关键词**: photorealistic, high resolution, professional photography, detailed textures

---

### 9. 抽象艺术 (abstract)

**适用场景**: 艺术表达、情绪传达、装饰画

**风格特征**:
- 非具象形式
- 色彩和形状的组合
- 情感表达
- 自由创作

**提示词关键词**: abstract art, non-representational, color composition, emotional expression

---

## 自动选择规则

Agent 可以根据以下信号自动推荐风格:

| 内容信号 | 推荐风格 | 理由 |
|---------|---------|------|
| 儿童、童话、温馨 | 水彩风格 | 柔和亲切 |
| 科技、商业、数据 | 扁平化设计 | 现代专业 |
| 产品、建筑、展示 | 3D 渲染 | 立体真实 |
| 艺术、经典、肖像 | 油画风格 | 艺术感强 |
| 科幻、未来、夜景 | 赛博朋克 | 氛围独特 |
| 复古、游戏、简约 | 像素艺术 | 怀旧趣味 |
| 创意、个性、漫画 | 手绘插画 | 亲和力强 |
| 真实、摄影、产品 | 照片写实 | 高度真实 |
| 情绪、装饰、艺术 | 抽象艺术 | 表达自由 |

## 使用方法

### 在 generate-prompt.js 中使用

```javascript
// 读取风格库
const styleLibrary = fs.readFileSync(
  path.join(__dirname, '../config.example/style-library.md'),
  'utf-8'
);

// 根据用户描述推荐风格
function recommendStyle(description) {
  const keywords = {
    '水彩风格': ['儿童', '童话', '温馨', '柔和'],
    '扁平化设计': ['科技', '商业', '数据', '现代'],
    '3D 渲染': ['产品', '建筑', '展示', '立体'],
    // ... 其他风格
  };

  for (const [style, words] of Object.entries(keywords)) {
    if (words.some(word => description.includes(word))) {
      return style;
    }
  }

  return null; // 无法自动推荐,让用户手动选择
}
```

### 在提示词中引用

```markdown
## 提示词

[具体内容描述]

## 风格

参考风格库中的 [风格名称] 风格
```
