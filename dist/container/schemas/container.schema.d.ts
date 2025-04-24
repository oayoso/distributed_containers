import { Schema } from 'mongoose';
export declare const ContainerSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, {
    containerId: string;
    state: string;
    timestamp: NativeDate;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    containerId: string;
    state: string;
    timestamp: NativeDate;
}>> & import("mongoose").FlatRecord<{
    containerId: string;
    state: string;
    timestamp: NativeDate;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
