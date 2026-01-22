---
name: pw-embedded-c-style
description: 嵌入式 C 代码风格助手。基于 51 单片机例程学习的代码规范, 用于创建项目和优化代码。
---

# pw-embedded-c-style

> 嵌入式 C 代码风格助手
> 基于《手把手教你学51单片机》302 个 .c 文件和 66 个 .h 文件的代码风格分析

## 使用方式

```bash
# 创建项目
/pw-embedded-c-style 创建一个 LED 闪烁的项目

# 优化代码
/pw-embedded-c-style 帮我优化这段按键扫描代码
```

---

## 核心规范

### 命名规范

```c
// 函数: 大驼峰
void ConfigTimer0(unsigned int ms);
void LcdWriteCmd(unsigned char cmd);
void InitDS1302(void);

// 变量: 小驼峰
unsigned char flag500ms = 0;
unsigned char cntRxd = 0;

// 宏/常量: 全大写下划线
#define SYS_MCLK    (11059200/12)
#define LCD1602_RS  P1^0

// sbit: 全大写或大驼峰
sbit LED = P0^0;
sbit ENLED = P1^4;
```

### 代码组织

**单文件项目**
```c
#include <reg52.h>

// 宏定义
// sbit 定义
// 全局变量
// 函数声明

void main() { }
// 函数实现
// 中断函数
```

**多文件项目**
```
config.h    - 全局配置 (类型定义、系统参数、IO 定义)
module.h    - 模块头文件 (结构体、extern 声明、函数声明)
module.c    - 模块实现 (#define _MODULE_C)
main.c      - 主程序
```

### 常用模式

**定时器配置**
```c
void ConfigTimer0(unsigned int ms)
{
    unsigned long tmp;
    tmp = 11059200 / 12;
    tmp = (tmp * ms) / 1000;
    tmp = 65536 - tmp;
    tmp = tmp + 12;
    T0RH = (unsigned char)(tmp>>8);
    T0RL = (unsigned char)tmp;
    TMOD &= 0xF0;
    TMOD |= 0x01;
    TH0 = T0RH;
    TL0 = T0RL;
    ET0 = 1;
    TR0 = 1;
}
```

**中断服务函数**
```c
void InterruptTimer0() interrupt 1
{
    static unsigned char tmr500ms = 0;
    TH0 = T0RH;
    TL0 = T0RL;
    if (++tmr500ms >= 50)
    {
        tmr500ms = 0;
        flag500ms = 1;
    }
}
```

**标志位驱动**
```c
bit flag500ms = 0;

// 中断中设置
flag500ms = 1;

// 主循环检测
while (1)
{
    if (flag500ms)
    {
        flag500ms = 0;
        // 执行任务
    }
}
```

**按键消抖**
```c
void KeyScan(void)
{
    static unsigned char keybuf[4] = {0xFF, 0xFF, 0xFF, 0xFF};
    keybuf[i] = (keybuf[i] << 1) | KEY_IN[i];
    if ((keybuf[i] & 0x0F) == 0x00)
        KeySta[i] = 0;  // 稳定按下
}
```

**查表法**
```c
unsigned char code LedChar[] = {
    0xC0, 0xF9, 0xA4, 0xB0, 0x99, 0x92, 0x82, 0xF8,
    0x80, 0x90, 0x88, 0x83, 0xC6, 0xA1, 0x86, 0x8E
};
P0 = LedChar[num];
```

### 注释风格

```c
/* 文件头注释 */
/*
*******************************************************************************
* 文件名称: main.c
* 描  述: 功能描述
* 版本号: v1.0.0
*******************************************************************************
*/

/* 函数注释 */
void LcdShowStr(unsigned char x, unsigned char y,
                unsigned char *str, unsigned char len)

// 行内注释
EA = 1;                     // 使能总中断
ConfigTimer0(10);           // 配置 T0 定时 10ms
```

---

## 代码风格特点

- 简洁直接, 避免过度抽象
- 直接操作硬件寄存器
- 使用 sbit 定义 IO 口
- 中断向量号直接指定 (interrupt 1)
- 存储区域修饰符 (code, pdata)
- 标志位驱动主循环
- 查表法处理数据映射

---

## 适用场景

- 51 单片机项目
- STM32 嵌入式项目
- 其他嵌入式 C 项目

基于实际教学项目总结, 注重实用性和可读性。
