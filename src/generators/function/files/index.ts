import { Context } from '@azure/functions';

async function fn(context: Context) {
  return {
    body: {
      value: 'Hello World',
    },
  };
}

export default fn;
