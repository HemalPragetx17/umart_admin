import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { Button, Col, Form, Row } from 'react-bootstrap';

const TextEditor = ({
  data,
  handleDataChange,
}: {
  data: string;
  handleDataChange: (newData: string) => void;
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ['blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'video'],
            ['code-block'],
            [{ size: ['small', false, 'large', 'huge'] }],
            ['clean'],
            [{ script: 'sub' }, { script: 'super' }],
          ],
        },
      });
      quillRef.current = quill;
      if (data) {
        quill.clipboard.dangerouslyPasteHTML(data);
      }
      quill.on('text-change', () => {
        const newData = quill.root.innerHTML;
        handleDataChange(newData);
      });
    }
  }, []);

  return (
    <Row>
      <Col lg={12}>
        <div>
          <Form.Group controlId="formBasicEmail">
            <div
              ref={editorRef}
              style={{ minHeight: '300px' }}
            />
          </Form.Group>
        </div>
      </Col>
    </Row>
  );
};

export default TextEditor;
