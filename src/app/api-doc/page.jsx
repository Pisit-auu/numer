import ReactSwagger from "./react-swagger";
import { getApiDocs } from "../lib/swagger";

export const metadata = {
  title: "API",
  description: "เอกสาร REST API สำหรับบันทึกและเรียกคืนสมการของทุกกลุ่มปัญหา",
};

export default async function ApiDocsPage() {
  const spec = await getApiDocs();

  return (
    <main className="page">
      <header className="mb-7">
        <h1 className="page-title">API</h1>
        <p className="page-lead">
          ทุกเมธอดบันทึกพารามิเตอร์ผ่าน REST API ชุดนี้ ลองยิงคำขอได้จากหน้านี้โดยตรง
        </p>
      </header>

      <section className="card overflow-hidden">
        <div className="card__body">
          <ReactSwagger spec={spec} />
        </div>
      </section>
    </main>
  );
}
