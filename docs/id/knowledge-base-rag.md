# Basis Pengetahuan & RAG

TahuJS memungkinkan Anda untuk "melatih" (memasukkan) pengetahuan kustom Anda sendiri dan mengambilnya untuk augmentasi AI. Ini sangat penting untuk menyediakan AI Anda dengan informasi terbaru atau spesifik domain di luar data pelatihan awalnya.

### Cara Kerjanya:

1.  **Pemasukan (`trainKnowledge`)**: Anda menyediakan data teks. TahuJS mengubah teks ini menjadi representasi numerik yang disebut "embeddings" menggunakan model embedding. Embeddings ini, bersama dengan teks aslinya, disimpan dalam penyimpanan vektor yang dipilih.
2.  **Pengambilan (`retrieveKnowledge`)**: Ketika Anda memiliki kueri, TahuJS mengubah kueri menjadi embedding dan mencari penyimpanan vektor untuk potongan pengetahuan yang paling relevan secara semantik.
3.  **Augmentasi**: Pengetahuan yang diambil kemudian dapat diteruskan ke LLM sebagai konteks, memungkinkannya menghasilkan respons yang lebih terinformasi dan akurat.

### Alat:

- **`trainKnowledge`**:
  - **Deskripsi**: Menambahkan data teks ke basis pengetahuan yang ditentukan untuk pengambilan nanti.
  - **Format Input**: `"knowledgeBaseName|storeType|source_type|source_data"`
  - **Tipe Penyimpanan yang Didukung**: `sqlite`, `chroma`, `supabase`
  - **Tipe Sumber yang Didukung**: `text`, `file`, `url`
  - **Contoh**:
    - `"my_docs|sqlite|text|This is a document about TahuJS features."`
    - `"my_docs|sqlite|file|/path/to/your/knowledge.txt"`
    - `"my_docs|sqlite|url|https://example.com/knowledge.txt"`
- **`retrieveKnowledge`**:
  - **Deskripsi**: Mengambil informasi yang relevan dari basis pengetahuan yang ditentukan.
  - **Format Input**: `"knowledgeBaseName|storeType|query_text|k"` (k opsional, default 3)
  - **Supported Store Types**: `sqlite`, `chroma`, `supabase`
  - **Example**: `"my_docs|sqlite|What are TahuJS features?|2"`

### Opsi Penyimpanan:

- **SQLite**:
  - **Tipe**: `sqlite`
  - **Deskripsi**: Basis data lokal berbasis file yang sederhana. Ideal untuk basis pengetahuan berukuran kecil hingga menengah atau pengembangan lokal. Tidak memerlukan server eksternal.
  - **Konfigurasi**: Secara otomatis menggunakan file `.sqlite` di direktori `memory`.
- **ChromaDB**:
  - **Tipe**: `chroma`
  - **Deskripsi**: Basis data vektor open-source khusus. Cocok untuk basis pengetahuan yang lebih besar dan pencarian kemiripan yang lebih efisien. Membutuhkan server ChromaDB terpisah untuk berjalan.
  - **Konfigurasi**: Atur `chromaDbUrl` di konfigurasi TahuJS (default `http://localhost:8000`).
  - **Pengaturan**: Anda perlu menjalankan instansi ChromaDB. Lihat [dokumentasi ChromaDB](https://www.trychroma.com/) untuk instalasi.
- **Supabase (PostgreSQL dengan pgvector)**:
  - **Tipe**: `supabase`
  - **Deskripsi**: Basis data PostgreSQL berbasis cloud yang kuat dan skalabel dengan ekstensi `pgvector` untuk penyimpanan vektor. Ideal untuk aplikasi produksi yang membutuhkan manajemen data yang kuat dan skalabilitas.
  - **Konfigurasi**: Membutuhkan `supabaseUrl` dan `supabaseAnonKey` di konfigurasi TahuJS.
  - **Pengaturan**: Anda perlu menyiapkan proyek Supabase, mengaktifkan ekstensi `pgvector`, dan mengkonfigurasi tabel Anda. Lihat contoh SQL di bagian "Penggunaan Dasar" di atas.