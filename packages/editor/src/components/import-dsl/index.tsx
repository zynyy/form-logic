import { FC, useState } from 'react';
import { Button, message, Upload } from 'antd';

import { ExportOutlined } from '@ant-design/icons';

import { Graph } from '@antv/x6';

interface ImportDSLProps {
  graph: Graph;
}

const ImportDSL: FC<ImportDSLProps> = ({ graph }) => {
  const [disabled, setDisabled] = useState(false);
  const beforeUpload = (file: File) => {
    setDisabled(true);
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (evt) => {
      setDisabled(false);
      if (!evt.target) {
        message.error('加载文件失败!').then(() => void 0);
      } else {
        try {
          const dsl = JSON.parse(evt.target.result as string);
          graph.fromJSON(dsl);
        } catch (err) {
          message.error('DSL解析失败!').then(() => void 0);
        }
      }
    };

    return false;
  };

  return (
    <Upload accept={'.json'} disabled={disabled} showUploadList={false} beforeUpload={beforeUpload}>
      <Button icon={<ExportOutlined />}>导入DSL</Button>
    </Upload>
  );
};

export default ImportDSL;
