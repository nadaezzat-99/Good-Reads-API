import {Schema,model} from 'mongoose';
import { Counter } from '../schemaInterfaces';
const schema  = new Schema<Counter>({
    id:String,
    seq:{
        type:Number,
    },
})

const Counter = model("counter",schema);

module.exports = Counter;