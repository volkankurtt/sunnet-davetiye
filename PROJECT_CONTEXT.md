# 1. Proje Özeti

Proje: `sunnet-davetiye`

Amaç: Mustafa Atlas Sölüm için sünnet davetiyesi, anı defteri, fotoğraf yükleme ve galeri sitesi.

Etkinlik:

- 11 Eylül 2026
- Köşdere Aktivite Merkezi
- Sakarya Mah. 320. Sokak No: 29

Müşteri tasarımı mevcut haliyle onayladı. Uygulama local ortamda çalışıyor ve production deploy’a hazır.

---

# 2. Kritik Kural

Orijinal proje:

`C:\Users\volka\dugun-anisi`

sadece referans/template’dir.

Bu projeye **ASLA** değişiklik yapılmamalı. Dosya düzenleme, `.env` değişikliği, config değişikliği ve git işlemi yasaktır.

Aktif proje:

`C:\Users\volka\sunnet-davetiye`

Bütün geliştirme sadece burada yapılır.

---

# 3. Teknoloji Stack

Frontend:

- React
- Vite
- TypeScript
- Vitest

Backend:

- Java
- Spring Boot
- Maven
- Spring Data JPA
- Flyway

Database:

- Supabase PostgreSQL

Object Storage:

- Supabase Storage

Production plan:

- Frontend → Cloudflare Pages
- Backend → Render Web Service
- Database/Storage → Supabase
- DNS/domain → Cloudflare

---

# 4. Frontend Özellikleri

Mevcut çalışan özellikler:

- Fullscreen intro video
- Autoplay / browser autoplay fallback (`Sesi Aç` / `Sesli Başlat`)
- `Geç` butonu
- `Sesi Aç` / `Sesi Kapat`
- Volume slider
- Video bitince fade transition ve ana sayfaya geçiş
- Hero görsel
- Responsive desktop/mobile layout
- Countdown
- Mekan / yol tarifi
- Fotoğraf Yükle
- Galeriyi Gör
- Davetiyeyi Paylaş
- Anı Defteri
- Galeri
- Lightbox
- Galeri blur background
- Buton hover animasyonları

Müşteri onaylı metinler:

Üst başlık: `ANLAR GEÇER ANILAR KALIR`

Ana isim: `Mustafa Atlas Sölüm`

Açıklama: `Bu geceden size kalan güzel anılarınızı ve geceye bırakacağınız notları bizimle paylaşmayı unutmayın. 🧡`

Intro video: `frontend/public/videos/intro.mp4`

Hero: `frontend/public/images/hero.jpeg`

Metinler `frontend/src/config/eventConfig.ts` üzerinden gelir. Onaylı UI, intro ve hero değiştirilmemelidir.

---

# 5. Fotoğraf Upload Mimarisi

Frontend fotoğrafı upload öncesinde optimize eder.

Yaklaşık:

- maksimum uzun kenar 1920px
- JPEG kalite ~%83
- kontrollü paralel upload
- maksimum 4 eşzamanlı upload
- her fotoğraf ayrı hata yönetimi

Akış:

Frontend → Spring Boot → Supabase Storage → PostgreSQL photo metadata → Gallery

Bucket: `guest-photos`

Yeni sistem, orijinal template’e göre belirgin şekilde daha hızlı upload yapar. Upload algoritması yeniden yazılmamalıdır.

---

# 6. Database

Supabase PostgreSQL kullanılır.

Flyway schema version: `v4`

Migration’lar:

- baseline
- memories
- photos
- photo client upload id

Tablolar:

- `memories`
- `photos`
- `flyway_schema_history`

RLS: bu üç tabloda da enabled.

Backend PostgreSQL bağlantısı üzerinden erişir. Yeni migration veya schema değişikliği eklenmemelidir.

---

# 7. Supabase Storage

Bucket: `guest-photos`

Public bucket olarak oluşturuldu.

Fotoğraf upload ve galeri görüntüleme çalışıyor.

Güncel Supabase Secret Key sistemi kullanılıyor (`sb_secret_...` geçerli backend key’dir; legacy `eyJ...` JWT zorunlu değildir).

Backend secret key frontend’e verilmez, log/response/exception’a yazılmaz.

---

# 8. Backend

Local port: `8080`

Health endpoint: `GET /api/health`

Çalışan endpointler:

- photos (`GET /api/photos`, upload-session, finalize, multipart upload)
- memories (`GET` / `POST /api/memories`)
- upload/gallery ile ilgili mevcut endpointler

Backend local’de çalışıyor.

Render compatibility: `application.yml` zaten

```yaml
server:
  port: ${PORT:8080}
```

mantığını destekler.

Render root directory: `backend`

Render build command:

`./mvnw clean package -DskipTests`

Render start command:

`java -jar target/backend-0.0.1-SNAPSHOT.jar`

---

# 9. Backend Environment Variables

Yalnızca isimler (değer yazılmaz):

- `SUPABASE_DB_URL`
- `SUPABASE_DB_USER`
- `SUPABASE_DB_PASSWORD`
- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`

Fallback:

- `SUPABASE_SERVICE_ROLE_KEY`

Diğer:

- `CORS_ORIGINS`
- `TRUST_FORWARDED_HEADERS`
- `TRUSTED_PROXIES`
- `ADMIN_TOKEN`

Opsiyonel:

- `SUPABASE_STORAGE_BUCKET`
- `SUPABASE_PUBLIC_STORAGE_BASE_URL`
- `MAGICK_COMMAND`

`PORT` Render tarafından sağlanır.

Gerçek değerleri asla yazma, kopyalama veya loglama.

---

# 10. Frontend Production Config

API client: `frontend/src/api/client.ts`

Variable: `VITE_API_BASE_URL`

Development fallback: `http://localhost:8080`

Production: Cloudflare Pages environment variable olarak Render backend origin’i verilecek.

Hard-coded production URL yoktur.

Cloudflare Pages:

- Root directory: `frontend`
- Build: `npm run build`
- Output: `dist`

SPA routing: `frontend/public/_redirects`

```
/*    /index.html   200
```

Bu sayede `/gallery` (ve `/upload`) doğrudan açılabilir.

---

# 11. Git / Secret Güvenliği

`.env` dosyaları commit edilmez.

Ignore edilenler:

- `.env`
- `.env.local`
- `.env.*.local`

`.env.example` dosyalarında yalnızca variable isimleri / placeholder’lar bulunur. Gerçek secret bulunmaz.

ÖNEMLİ: Production deploy öncesinde daha önce paylaşılan Supabase secret / admin token gibi credential’lar rotate edilmelidir.

---

# 12. Local Çalıştırma

Backend:

```
cd C:\Users\volka\sunnet-davetiye\backend
.\mvnw.cmd spring-boot:run
```

Frontend:

```
cd C:\Users\volka\sunnet-davetiye\frontend
npm run dev
```

Adresler:

- Frontend: http://localhost:5173
- Backend: http://localhost:8080

---

# 13. Test Durumu

Frontend:

- `npm run build` başarılı
- Vitest 14/14 başarılı

Backend:

- Maven build başarılı
- JAR başarıyla üretiliyor (`backend-0.0.1-SNAPSHOT.jar`)

Local regression:

- intro video çalışıyor
- ses kontrolleri çalışıyor
- fotoğraf upload çalışıyor
- galeri çalışıyor
- memories çalışıyor
- countdown çalışıyor
- route’lar çalışıyor

---

# 14. Production Deploy Planı

Henüz dashboard deploy yapılmadı.

Sıradaki işler:

1. Bu production-ready değişiklikleri commit et.
2. GitHub repo oluştur / push et.
3. Render’da backend Web Service oluştur.
4. Render environment variables gir.
5. Backend production URL al.
6. Cloudflare Pages project oluştur.
7. `VITE_API_BASE_URL` değerini Render URL’si yap.
8. Cloudflare Pages deploy et.
9. Render `CORS_ORIGINS` içine Pages origin ekle.
10. Gerçek internet üzerinden regression testi yap.
11. Fotoğraf upload testi yap.
12. Gallery direct URL testi yap.
13. Mobile test yap.
14. Production stabil commit oluştur.
15. Müşteri domain onayı verdiğinde domain satın al.
16. Cloudflare custom domain bağla.
17. İstenirse backend için `api.<domain>` custom domain bağla.
18. Final QR oluştur.

---

# 15. Production Domain Planı

Örnek:

- `domain.com` → Cloudflare Pages frontend
- `api.domain.com` → Render backend

Domain henüz alınmadı.

Şimdilik:

- Cloudflare `*.pages.dev`
- Render `*.onrender.com`

staging/production preview URL’leri kullanılacak.

---

# 16. Yapılmaması Gerekenler

Yeni Cursor sohbetinde:

- müşteri onaylı UI’yı değiştirme
- intro videoyu değiştirme
- hero değiştirme
- upload algoritmasını yeniden yazma
- backend endpointlerini değiştirme
- database schema’yı değiştirme
- gereksiz migration ekleme
- Supabase bucket değiştirme
- `dugun-anisi` projesine dokunma
- production-ready çalışan sistemi refactor etme

Önce bu `PROJECT_CONTEXT.md` dosyasını oku ve mevcut mimariyi koru.

---

## NEXT STEP

Render backend deployment ile devam et. Backend başarılı deploy edildikten sonra Render URL'sini VITE_API_BASE_URL olarak Cloudflare Pages'e bağla.
