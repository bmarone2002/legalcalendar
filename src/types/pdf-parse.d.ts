// pdf-parse-debugging-disabled@1.1.1 (stessa API di pdf-parse, senza debug che apre test/data)
declare module "pdf-parse-debugging-disabled" {
  function pdfParse(buffer: Buffer): Promise<{ text?: string }>;
  export default pdfParse;
}
