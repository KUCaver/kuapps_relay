# 릴레이 블룸 (건국대학교 캠퍼스 스마트 릴레이 가드닝)

이 프로젝트는 캠퍼스 내 식물들을 학생들이 릴레이 방식으로 쉽게 관리하고 기록할 수 있도록 돕는 PWA(프로그레시브 웹 앱) 기반의 웹 서비스입니다.

## 기술 스택
- **프론트엔드:** Next.js (App Router), Tailwind CSS, PWA, Lucide React
- **백엔드:** Spring Boot 3.x, Spring Data JPA, H2 Database (로컬 테스트용)

## 필요 환경 (사전 설치)
- **Node.js:** v18 이상 (프론트엔드 실행용)
- **Java:** JDK 17 (백엔드 실행용)

## 실행 방법

### 1. 백엔드(Spring Boot) 실행하기
백엔드는 로컬에서 테스트하기 쉽도록 메모리 DB(H2)를 사용하며, 실행 시 자동으로 샘플 식물 데이터가 3개 등록됩니다.

1. 터미널을 열고 `backend` 폴더로 이동합니다.
2. 다음 명령어를 입력합니다:
   ```sh
   cd backend
   ./gradlew bootRun     # macOS / Linux
   gradlew.bat bootRun   # Windows
   ```
* 백엔드 API 서버는 `http://localhost:8080` 에서 실행됩니다.
* 데이터베이스(H2 Console)는 `http://localhost:8080/h2-console` 에서 확인 가능합니다. (JDBC URL: `jdbc:h2:mem:relaybloomdb`, User: `sa`, 비밀번호 없음)

### 2. 프론트엔드(Next.js PWA) 실행하기
1. 새로운 터미널을 열고 `frontend` 폴더로 이동합니다.
2. 다음 명령어를 입력합니다:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```
* 프론트엔드 웹 서비스는 `http://localhost:3000` 에서 접속할 수 있습니다.
