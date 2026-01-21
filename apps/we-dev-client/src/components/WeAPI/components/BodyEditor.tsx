import React from 'react';
import { Radio, Input, Button, Upload, Space, Select } from 'antd';
import type { RadioChangeEvent } from 'antd/es/radio';
import { DeleteOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { BodyType, RequestBody, FormDataItem } from '../types';

const { TextArea } = Input;

interface BodyEditorProps {
  bodyType?: BodyType;
  body?: RequestBody;
  onUpdate: (bodyType: BodyType, body: RequestBody) => void;
}

function BodyEditor({ bodyType = 'none', body = {}, onUpdate }: BodyEditorProps): JSX.Element {
  const handleBodyTypeChange = (e: RadioChangeEvent) => {
    const newBodyType = e.target.value as BodyType;
    onUpdate(newBodyType, body);
  };

  const handleBodyChange = (newBodyData: any) => {
    const updatedBody = {
      ...body,
      [bodyType]: newBodyData
    };
    onUpdate(bodyType, updatedBody);
  };

  const renderFormDataItem = (item: FormDataItem, index: number) => {
    return (
      <Space key={index} style={{ display: 'flex', marginBottom: 8, width: '100%' }}>
        <Input
          placeholder="Key"
          value={item.key}
          onChange={(e) => {
            const newFormData = [...(body.formData || [])];
            newFormData[index] = { ...item, key: e.target.value };
            handleBodyChange(newFormData);
          }}
          style={{ width: 200 }}
        />
        <Select
          value={item.type || 'text'}
          onChange={(value) => {
            const newFormData = [...(body.formData || [])];
            newFormData[index] = { ...item, type: value, value: '' };
            handleBodyChange(newFormData);
          }}
          style={{ width: 100 }}
        >
          <Select.Option value="text">Text</Select.Option>
          <Select.Option value="file">File</Select.Option>
        </Select>
        {item.type === 'file' ? (
          <Upload
            beforeUpload={(file) => {
              const newFormData = [...(body.formData || [])];
              newFormData[index] = { 
                ...item, 
                value: file,
                fileName: file.name
              };
              handleBodyChange(newFormData);
              return false;
            }}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>
              {item.fileName || 'Select File'}
            </Button>
          </Upload>
        ) : (
          <Input
            placeholder="Value"
            value={typeof item.value === 'string' ? item.value : (item.value ? (item.value as File).name : '')}
            onChange={(e) => {
              const newFormData = [...(body.formData || [])];
              newFormData[index] = { ...item, value: e.target.value };
              handleBodyChange(newFormData);
            }}
            style={{ width: 200 }}
          />
        )}
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => {
            const newFormData = (body.formData || []).filter((_, i) => i !== index);
            handleBodyChange(newFormData);
          }}
        />
      </Space>
    );
  };

  const renderBodyEditor = () => {
    switch (bodyType) {
      case 'json':
        return (
          <TextArea
            rows={10}
            value={typeof body.json === 'string' ? body.json : JSON.stringify(body.json, null, 2)}
            onChange={(e) => {
              try {
                const jsonObj = JSON.parse(e.target.value);
                handleBodyChange(jsonObj);
              } catch (e) {
                handleBodyChange((e as any).target.value);
              }
            }}
            placeholder="Enter JSON content"
          />
        );
      case 'formData':
        return (
          <div>
            {(body.formData || []).map((item: FormDataItem, index: number) => 
              renderFormDataItem(item, index)
            )}
            <Button
              type="dashed"
              onClick={() => handleBodyChange([...(body.formData || []), { 
                key: '', 
                value: '',
                type: 'text'
              }])}
              icon={<PlusOutlined />}
              style={{ width: '100%' }}
            >
              Add Field
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-sm">
      <Radio.Group value={bodyType} onChange={handleBodyTypeChange} style={{ marginBottom: 16 }}>
        <Radio.Button value="none">None</Radio.Button>
        <Radio.Button value="json">JSON</Radio.Button>
        <Radio.Button value="formData">Form Data</Radio.Button>
      </Radio.Group>
      {renderBodyEditor()}
    </div>
  );
}

export default BodyEditor; 