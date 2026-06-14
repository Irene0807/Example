import glob
import requests # requests 抓取網路資料 (爬蟲)
import numpy as np # numpy 高效能多微陣列運算
import pandas as pd # pandas 讀取、操作表格資料 (python的excel)
import matplotlib
matplotlib.use("Agg") # 伺服器環境沒有畫面，用非互動式繪圖後端
import matplotlib.pyplot as plt # matplotlib 畫圖
import matplotlib.animation as animation
from matplotlib.patches import Rectangle
from flask import Flask, jsonify, send_file

app = Flask(__name__)


# 允許網頁（不同網域/file://）呼叫這個 API
@app.after_request
def add_cors_header(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    return response


# 爬取台北即時氣溫，並依氣溫決定粒子顏色
def get_weather():
    url = "https://api.open-meteo.com/v1/forecast?latitude=25.03&longitude=121.56&current_weather=true"
    temperature = requests.get(url, timeout=10).json()["current_weather"]["temperature"]

    if temperature >= 28:
        particle_color = "red"
    elif temperature >= 20:
        particle_color = "green"
    else:
        particle_color = "blue"

    return temperature, particle_color


# 產生粒子模擬動畫 GIF
def generate_animation(particle_color):
    files = sorted(glob.glob("output/frame_*.csv"))

    fig, ax = plt.subplots(figsize=(8, 8)) # fig畫布,ax座標區
    ax.set_xlim(0, 100) # 設定x軸從0-100
    ax.set_ylim(0, 100) # 設定y軸從0-100
    ax.set_xlabel("X (km)") # x坐標軸名稱
    ax.set_ylabel("Y (km)") # y坐標軸名稱
    ax.set_title("Urban Air Pollution Particle Transport") # 標題名稱

    buildings = [
        Rectangle((35, 30), 10, 20, alpha=0.35), # 建築物1：左下角(35,30)，寬10，高20, 透明度35%
        Rectangle((55, 50), 12, 18, alpha=0.35), # 建築物2
        Rectangle((70, 25), 8, 25, alpha=0.35)  # 建築物3
    ]
    for b in buildings:
        ax.add_patch(b)

    ax.scatter([20], [20], marker="*", s=250, label="Emission Source", c="yellow")
    ax.arrow(10, 70, 15, 5, head_width=2.5, head_length=3, length_includes_head=True, color="green")
    ax.text(27, 75, "Wind", fontsize=11)

    scatter = ax.scatter([], [], s=1, alpha=0.35, c=particle_color)
    ax.legend(loc="upper left")

    def init():
        scatter.set_offsets(np.empty((0, 2)))
        return (scatter,)

    def update(frame_idx):
        df = pd.read_csv(files[frame_idx])
        offsets = df[["x", "y"]].to_numpy()
        scatter.set_offsets(offsets)
        ax.set_title(f"Urban Air Pollution Particle Transport (Frame {frame_idx})")
        return (scatter,)

    ani = animation.FuncAnimation(fig, update, frames=len(files), init_func=init, interval=120, blit=True)
    ani.save("particle_animation.gif", writer="pillow", fps=8) # 每秒 8 幀
    plt.close(fig)


# 1. 回傳目前氣溫與粒子顏色（快速）
@app.route("/weather", methods=["GET"])
def weather():
    temperature, particle_color = get_weather()
    return jsonify(temperature=temperature, particle_color=particle_color)


# 2. 產生並回傳動畫 GIF（約30秒，因為要跑過200多個檔案）
@app.route("/animation", methods=["GET"])
def animation_endpoint():
    _, particle_color = get_weather()
    generate_animation(particle_color)
    return send_file("particle_animation.gif", mimetype="image/gif")


if __name__ == "__main__":
    app.run(debug=True)


# http://127.0.0.1:5000/animation

# python api.py 打開伺服器
