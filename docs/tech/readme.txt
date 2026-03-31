Shadcn:
$> cd apps/web
$> npx shadcn@latest add button card input form


Prerequisit. Install Minio
Start Minio: 
$> minio server ~/minio-data --console-address ":9001"
minio.service will create documents bucket if you haven't created.
else: create a bucket: 'documents'