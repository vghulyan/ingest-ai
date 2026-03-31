Create:
POST /api/documents
curl -X POST http://localhost:7111/api/documents/upload \
  -F "file=@apps/api/data/test.pdf"
  



Get all:
GET /api/documents
curl http://localhost:3445/api/documents
Response:
[{"id":"d42f8b9d-5f56-4625-a505-7869f7d9a174","fileName":"contract.pdf","fileUrl":"http://localhost:9000/documents/contract.pdf","mimeType":"application/pdf","size":123456,"status":"UPLOADED","extractedJson":null,"createdAt":"2026-03-31T11:55:20.756Z","updatedAt":"2026-03-31T11:55:20.756Z"}]



Get one:
GET /api/documents/:id
curl http://localhost:3445/api/documents/d42f8b9d-5f56-4625-a505-7869f7d9a174
Response:
{"id":"d42f8b9d-5f56-4625-a505-7869f7d9a174","fileName":"contract.pdf","fileUrl":"http://localhost:9000/documents/contract.pdf","mimeType":"application/pdf","size":123456,"status":"UPLOADED","extractedJson":null,"createdAt":"2026-03-31T11:55:20.756Z","updatedAt":"2026-03-31T11:55:20.756Z"}