module.exports = {
  apps: [
    {
      name: 'hd-server',
      script: './dist/main.js', // 컴파일된 NestJS 앱의 경로
      instances: 1,
      autorestart: true,
      watch: false,
      // max_memory_restart: '1G',
      // min_uptime: '60s', // 앱이 최소 60초간 살아있어야 실패한 시작으로 계산되지 않음
      max_restarts: 2, // min_uptime 기간 내의 최대 재시작 횟수
    },
  ],
};
