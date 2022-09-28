import { ISchema } from "@formily/react";

const schema: ISchema = {
  type: 'object',
  properties: {
    required_1: {
      name: 'required_1',
      title: '必填',
      type: 'string',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'MySelect',
      'x-component-props': {
        test: 11111
      },
    },
    required_2: {
      name: 'required_2',
      title: '必填',
      type: 'string',
      'x-validator': {
        required: true,
      },
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-value': '12'
    },
    required_3: {
      name: 'required_3',
      title: '必填',
      type: 'string',
      'x-validator': [
        {
          required: true,
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    max_1: {
      name: 'max_1',
      title: '最大值(>5报错)',
      type: 'number',
      maximum: 5,
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    max_2: {
      name: 'max_2',
      title: '最大值(>5报错)',
      type: 'number',
      'x-validator': {
        maximum: 5,
      },
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    max_3: {
      name: 'max_3',
      title: '最大值(>5报错)',
      type: 'number',
      'x-validator': [
        {
          maximum: 5,
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    max_4: {
      name: 'max_4',
      title: '最大值(>=5报错)',
      type: 'number',
      exclusiveMaximum: 5,
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    max_5: {
      name: 'max_5',
      title: '最大值(>=5报错)',
      type: 'number',
      'x-validator': {
        exclusiveMaximum: 5,
      },
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    max_6: {
      name: 'max_6',
      title: '最大值(>=5报错)',
      type: 'number',
      'x-validator': [
        {
          exclusiveMaximum: 5,
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    min_1: {
      name: 'min_1',
      title: '最小值(<5报错)',
      type: 'number',
      minimum: 5,
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    min_2: {
      name: 'min_2',
      title: '最小值(<5报错)',
      type: 'number',
      'x-validator': {
        minimum: 5,
      },
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    min_3: {
      name: 'min_3',
      title: '最小值(<5报错)',
      type: 'string',
      'x-validator': [
        {
          minimum: 5,
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    min_4: {
      name: 'min_4',
      title: '最小值(<=5报错)',
      type: 'number',
      exclusiveMinimum: 5,
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    min_5: {
      name: 'min_5',
      title: '最小值(<=5报错)',
      type: 'number',
      'x-validator': {
        exclusiveMinimum: 5,
      },
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    min_6: {
      name: 'min_6',
      title: '最小值(<=5报错)',
      type: 'number',
      'x-validator': [
        {
          exclusiveMinimum: 5,
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
    length_1: {
      name: 'length_1',
      title: '长度为5',
      type: 'string',
      'x-validator': {
        len: 5,
      },
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    length_2: {
      name: 'length_2',
      title: '长度为5',
      type: 'string',
      'x-validator': [
        {
          len: 5,
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    maxlength_1: {
      name: 'maxlength_1',
      title: '最大长度为5',
      type: 'string',
      maxLength: 5,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    maxlength_2: {
      name: 'maxlength_2',
      title: '最大长度为5',
      type: 'string',
      'x-validator': {
        max: 5,
      },
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    maxlength_3: {
      name: 'maxlength_3',
      title: '最大长度为5',
      type: 'string',
      'x-validator': [
        {
          max: 5,
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    minlength_1: {
      name: 'minlength_1',
      title: '最小长度为5',
      type: 'string',
      minLength: 5,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    minlength_2: {
      name: 'minlength_2',
      title: '最小长度为5',
      type: 'string',
      'x-validator': {
        min: 5,
      },
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    minlength_3: {
      name: 'minlength_3',
      title: '最小长度为5',
      type: 'string',
      'x-validator': [
        {
          min: 5,
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    whitespace: {
      name: 'whitespace',
      title: '排除纯空白字符',
      type: 'string',
      'x-validator': [
        {
          whitespace: true,
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    enum: {
      name: 'enum',
      title: '枚举匹配',
      type: 'string',
      'x-validator': [
        {
          enum: ['1', '2', '3'],
        },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    const: {
      name: 'const',
      title: '常量匹配',
      type: 'string',
      const: '123',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    multipleOf: {
      name: 'multipleOf',
      title: '整除匹配',
      type: 'string',
      multipleOf: 2,
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
    },
  },
}
export default schema;