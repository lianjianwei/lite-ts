import { EnumFacatoryBase, IParser, IValueConditionData } from '../..';
import { enum_ } from '../../model';

/**
 * 数值条件解析器
 */
export class ValueConditionParser<T extends { text: string, value: number }> implements IParser {
    /**
     * 匹配规则
     */
    public static reg = /^([^=><]+)([=><]+)(-?\d+)$/;

    /**
     * 构造函数
     * 
     * @param m_EnumFactory 枚举工厂
     * @param m_ValueTypeModel 枚举模型
     */
    public constructor(
        private m_EnumFactory: EnumFacatoryBase,
        private m_ValueTypeModel: new () => T
    ) { }

    /**
     * 解析
     * 
     * @param text 文本内容
     * 
     * @returns IValueConditionData[][]
     * 
     * @example
     * ```typescript
     *  const parser: ValueConditionParser<枚举模型>;
     *  const res = parser.parse(`A=-15
     *  B>=-5
     * 
     *  C<=20`);
     *  // res = [
     *      [
     *          { count: -15, eq: '=', valueType: A的枚举值 },
     *          { count: -5, eq: '>=', valueType: B的枚举值 }
     *      ],
     *      [
     *          { count: 20, eq: '<=', valueType: C的枚举值 }
     *      ]
     *  ]
     * ```
     */
    public async parse(text: string) {
        const lines = text.split(/\r\n|\n|\r/g);
        let res: IValueConditionData[][] = [[]];
        const valueTypeEnum = this.m_EnumFactory.build(this.m_ValueTypeModel);
        for (const r of lines) {
            const match = r.match(ValueConditionParser.reg);
            if (!match) {
                if (res[res.length - 1].length) {
                    res.push([]);
                    continue;
                }

                throw new Error(`无效数值条件格式: ${r}`);
            }

            const enumItem = await valueTypeEnum.get(cr => {
                return cr.text == match[1];
            });
            if (!enumItem)
                throw new Error(`无效数值条件名: ${r}`);

            const count = parseInt(match[3]);
            if (isNaN(count))
                throw new Error(`无效数值条件数量: ${r}`);

            res[res.length - 1].push({
                count: count,
                op: match[2] as enum_.RelationOperator,
                valueType: enumItem.data.value
            });
        }
        return res;
    }
}