import React from 'react';
import Document, { DocumentContext } from 'next/document';

class MyDocument extends Document {
  static getInitialProps(ctx: DocumentContext): any {
    return Document.getInitialProps(ctx);
  }

  render(): any {
    return <div>Blank Document</div>;
  }
}

export default MyDocument;
