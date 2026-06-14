import os
import glob
import numpy as np # numpy 高效能多微陣列運算
import pandas as pd # pandas 讀取、操作表格資料 (python的excel)
import matplotlib.pyplot as plt # matplotlib 畫圖
import matplotlib.animation as animation
from matplotlib.patches import Rectangle

# 1. 找出 output 資料夾中所有 frame_xxx.csv 檔案，依檔名排序
files = sorted(glob.glob("output/frame_*.csv"))

# 2. 建立畫布與座標軸，8x8
fig, ax = plt.subplots(figsize=(8, 8)) # fig畫布,ax座標區

ax.set_xlim(0, 100) # 設定x軸從0-100
ax.set_ylim(0, 100) # 設定y軸從0-100
ax.set_xlabel("X (km)") # x坐標軸名稱
ax.set_ylabel("Y (km)") # y坐標軸名稱
ax.set_title("Urban Air Pollution Particle Transport") # 標題名稱

# 3. 畫圖：建築物
buildings = [
    Rectangle((35, 30), 10, 20, alpha=0.35), # 建築物1：左下角(35,30)，寬10，高20, 透明度35%
    Rectangle((55, 50), 12, 18, alpha=0.35), # 建築物2
    Rectangle((70, 25), 8, 25, alpha=0.35)  # 建築物3
]
for b in buildings:
    ax.add_patch(b) # 因為固定就直接畫到圖上


# 3. 畫圖：污染源
ax.scatter([20], [20], marker="*", s=250, label="Emission Source", c="yellow")

# 3. 畫圖：風場箭頭
ax.arrow(10, 70, 15, 5, head_width=2.5, head_length=3, length_includes_head=True, color="green")
ax.text(27, 75, "Wind", fontsize=11)

# 3. 畫圖：粒子 (剛開始給空資料)
scatter = ax.scatter([], [], s=1, alpha=0.35, c="orange")

ax.legend(loc="upper left") # 顯示圖例label

# 4. 做動畫

# 初始化
def init():
    scatter.set_offsets(np.empty((0, 2))) # 在動畫開始前，先把粒子位置清空
    return (scatter,)

# 更新
def update(frame_idx):
    df = pd.read_csv(files[frame_idx]) # 讀取對應幀的 csv 檔
    offsets = df[["x", "y"]].to_numpy() # 取出 x, y 欄位，轉成 numpy array

    scatter.set_offsets(offsets) # 更新所有粒子的位置
    ax.set_title(f"Urban Air Pollution Particle Transport (Frame {frame_idx})") # 更新標題
    return (scatter,)

# 建立動畫
ani = animation.FuncAnimation(fig, update, frames=len(files), init_func=init, interval=120, blit=True)


# 5. 儲存成 GIF
ani.save("particle_animation.gif", writer="pillow", fps=8) # 每秒 8 幀
print("Saved particle_animation.gif")

# 因為要跑過200多個檔案，這裡要跑30多秒是正常的