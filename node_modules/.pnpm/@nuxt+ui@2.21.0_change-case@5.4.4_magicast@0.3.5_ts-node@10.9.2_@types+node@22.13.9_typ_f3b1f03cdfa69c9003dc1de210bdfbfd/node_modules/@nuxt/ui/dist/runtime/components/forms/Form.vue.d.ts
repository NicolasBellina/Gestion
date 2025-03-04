import { type PropType } from 'vue';
import type { ZodSchema } from 'zod';
import type { Schema as JoiSchema } from 'joi';
import type { ObjectSchema as YupObjectSchema } from 'yup';
import type { BaseSchema as ValibotSchema30, BaseSchemaAsync as ValibotSchemaAsync30 } from 'valibot30';
import type { GenericSchema as ValibotSchema31, GenericSchemaAsync as ValibotSchemaAsync31, SafeParser as ValibotSafeParser31, SafeParserAsync as ValibotSafeParserAsync31 } from 'valibot31';
import type { GenericSchema as ValibotSchema, GenericSchemaAsync as ValibotSchemaAsync, SafeParser as ValibotSafeParser, SafeParserAsync as ValibotSafeParserAsync } from 'valibot';
import type { Struct } from 'superstruct';
import type { FormError, FormEventType } from '../../types/form.js';
type Schema = PropType<ZodSchema> | PropType<YupObjectSchema<any>> | PropType<JoiSchema> | PropType<ValibotSchema30 | ValibotSchemaAsync30> | PropType<ValibotSchema31 | ValibotSchemaAsync31> | PropType<ValibotSafeParser31<any, any> | ValibotSafeParserAsync31<any, any>> | PropType<ValibotSchema | ValibotSchemaAsync> | PropType<ValibotSafeParser<any, any> | ValibotSafeParserAsync<any, any>> | PropType<Struct<any, any>>;
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    schema: {
        type: Schema;
        default: any;
    };
    state: {
        type: ObjectConstructor;
        required: true;
    };
    validate: {
        type: PropType<(state: any) => Promise<FormError[]>> | PropType<(state: any) => FormError[]>;
        default: () => any[];
    };
    validateOn: {
        type: PropType<FormEventType[]>;
        default: () => string[];
    };
}>, {
    onSubmit: (payload: Event) => Promise<void>;
    errors: Readonly<import("vue").Ref<readonly {
        readonly path: string;
        readonly message: string;
    }[], readonly {
        readonly path: string;
        readonly message: string;
    }[]>>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("error" | "submit")[], "error" | "submit", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    schema: {
        type: Schema;
        default: any;
    };
    state: {
        type: ObjectConstructor;
        required: true;
    };
    validate: {
        type: PropType<(state: any) => Promise<FormError[]>> | PropType<(state: any) => FormError[]>;
        default: () => any[];
    };
    validateOn: {
        type: PropType<FormEventType[]>;
        default: () => string[];
    };
}>> & Readonly<{
    onSubmit?: (...args: any[]) => any;
    onError?: (...args: any[]) => any;
}>, {
    schema: ZodSchema<any, import("zod").ZodTypeDef, any> | YupObjectSchema<any, import("yup").AnyObject, any, ""> | import("joi").AnySchema<any> | ValibotSchema30<any, any> | ValibotSchemaAsync30<any, any> | ValibotSchema31<unknown, unknown, import("valibot31").BaseIssue<unknown>> | ValibotSchemaAsync31<unknown, unknown, import("valibot31").BaseIssue<unknown>> | ValibotSafeParser31<any, any> | ValibotSafeParserAsync31<any, any> | ValibotSchema<unknown, unknown, import("valibot").BaseIssue<unknown>> | ValibotSchemaAsync<unknown, unknown, import("valibot").BaseIssue<unknown>> | Struct<any, any>;
    validate: ((state: any) => Promise<FormError[]>) | ((state: any) => FormError[]);
    validateOn: FormEventType[];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
