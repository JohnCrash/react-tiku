## 题型编辑
目前支持选择题（包括单选和多选），填空题，解答题，连线题。

### 选择题
选择题的选项是由大写字母后面接点，空格和选项内容组成，并且字母必须以ABCD...这样的顺序排列。字母后面如果加)表示该选项是一个正确答案。

例如:
>We need to go shopping. There is juice left in the fridge.
A. little
B).few
C. many
D. much

将被转换为下面的形式

>We need to go shopping. There is juice left in the fridge.
A. little
B). few
C. many
D. much

### 填空题
填空题的空使用双括号表示，双括号里面放置正确答案。
例如:

>We need to go shopping. There is ( (Nothing)) juice left in the fridge.

将被转换为下面的形式

>We need to go shopping. There is ((    )) juice left in the fridge.

内括号后面可以接数字表示空的长度。
例如:
>大空( ()9)
小空( ()2)

将被转换为下面的形式

>大空(()9)
小空(()2)

### 解答题
解答题使用两个方括号表示解答区。方括号内部是正确答案（解答题是主观题，这个正确答案仅仅是参考）。

例如:
>Do you remember what she looked like when you first met her? 
[ [Of course. She was tall and thin long hair.]]

将被转换为下面的形式

>Do you remember what she looked like when you first met her? 
[[]]

### 连线题
连线题的连接项以数字加横线(-)开始，数字必须以123...这样的正常序列起始。为了表示正确的连接关系，可以在横线后面接要连接的编号。

例如:

>将近义词连接起来
1 -6 安然
2-5 淘气
3-4 懊悔
4- 后悔 
5- 调皮
6- 安稳

将被转换为下面的形式

>将近义词连接起来
1-6 安然
2-5 淘气
3-4 懊悔
4- 后悔 
5- 调皮
6- 安稳

如果在第一项前面加上一根竖线|，将把连线题转换为竖排连线题

>将近义词连接起来
|1-6 安然
2-5 淘气
3-4 懊悔
4- 后悔 
5- 调皮
6- 安稳