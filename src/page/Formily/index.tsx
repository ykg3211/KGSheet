import React, { useState } from 'react'
import { createForm } from '@formily/core'
import { createSchemaField } from '@formily/react'
import { Form, FormItem, Input, NumberPicker } from '@formily/antd'
import MySelect from './components/select'
import schema from './schema'
import FormDisabledDemo from '../AntdForm'
const form = createForm({
  initialValues: {

  }
})
const SchemaField = createSchemaField({
  components: {
    Input,
    FormItem,
    NumberPicker,
  },
})



export default () => {
  const [components] = useState({
    MySelect
  })
  return (
    <Form form={form} labelCol={6} wrapperCol={10}>
      <SchemaField components={components} schema={schema} />
    </Form>
  )
}