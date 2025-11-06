# --------------------------------------------------
# 🐳 Next.js Local Development Image
# --------------------------------------------------
FROM node:22-alpine

# 작업 디렉토리
WORKDIR /usr/src/app

# 패키지 파일만 복사 후 의존성 설치 (캐싱 최적화)
COPY package*.json ./
RUN npm ci

# 전체 소스 복사
COPY . .

# Prisma를 사용한다면 Client를 미리 생성 (optional)
# 없으면 아래 두 줄은 삭제해도 됨
# RUN npx prisma generate
# 또는 환경별 사용 시:
# RUN npm run prisma:gen:local

# Next.js 기본 포트
EXPOSE 3000

# 개발 서버 실행 (Hot Reload)
CMD ["npm", "run", "dev"]
