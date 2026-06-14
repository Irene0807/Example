
#include <iostream>
#include <vector>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <cmath>
#include <cuda_runtime.h>

using namespace std;

struct Particle {
    float x, y;
};

__host__ __device__
float rand(int i, int step, int seed) {
    int n = i * 1973 + step * 9277 + seed * 26699;
    n = (n << 13) ^ n;
    return 1.0f - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0f;
}

__global__ void gpu(Particle* p, int N, int step, float dt, float wind_x, float wind_y, float diff, float settle) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < N) {
        float rx = rand(i, step, 1) * diff;
        float ry = rand(i, step, 2) * diff;

        p[i].x += wind_x * dt + rx;
        p[i].y += wind_y * dt + ry - settle * dt;

        if (p[i].x < 0) p[i].x = 0;
        if (p[i].x > 100) p[i].x = 100;
        if (p[i].y < 0) p[i].y = 0;
        if (p[i].y > 100) p[i].y = 100;
    }
}

void save_particles_to_csv(const vector<Particle>& particles, int frame_id) {
    ostringstream filename; //單純拼字串
    filename << "output/frame_" << setw(4) << setfill('0') << frame_id << ".csv";

    ofstream file(filename.str()); //把剛剛組好的檔名字串，拿去開檔案
    file << "x,y\n"; //寫進檔案
    for (const auto& p : particles) {
        file << p.x << "," << p.y << "\n";
    }
    file.close();
}

int main() {
    const int N = 10000;       //粒子數
    const int STEPS = 1000;      //總步數
    const int SAVE_EVERY = 5;   //每幾步輸出一次
    const float dt = 0.1f;

    // 風場：往右上吹
    const float wind_x = 0.75f;
    const float wind_y = 0.25f;

    // 擴散與沉降
    const float diff = 0.6f;
    const float settle = 0.05f;

    vector<Particle> h_particles(N);

    // 初始污染源：城市左下角偏中
    for (int i = 0; i < N; i++) {
        h_particles[i] = {20.0f, 20.0f};
    }

    Particle* d_particles;
    cudaMalloc(&d_particles, N * sizeof(Particle));
    cudaMemcpy(d_particles, h_particles.data(), N * sizeof(Particle), cudaMemcpyHostToDevice);

    int blockSize = 256;
    int gridSize = (N + blockSize - 1) / blockSize;

    int frame_id = 0;

    // 先存初始狀態
    save_particles_to_csv(h_particles, frame_id++);

    for (int t = 0; t < STEPS; t++) {
        gpu<<<gridSize, blockSize>>>(
            d_particles, N, t, dt, wind_x, wind_y, diff, settle
        );
        cudaDeviceSynchronize();

        if ((t + 1) % SAVE_EVERY == 0) {
            cudaMemcpy(h_particles.data(), d_particles, N * sizeof(Particle), cudaMemcpyDeviceToHost);
            save_particles_to_csv(h_particles, frame_id++);
            cout << "Saved frame " << frame_id - 1 << endl;
        }
    }

    cudaFree(d_particles);
    cout << "Simulation finished." << endl;
    return 0;
}
