import { IUnitOfWork } from './i-unit-of-work';

/**
 * 工作单元仓储
 */
export abstract class UnitOfWorkRepositoryBase implements IUnitOfWork {
    /**
     * 提交后函数数组
     */
    protected afterActions: (() => Promise<void>)[] = [];

    /**
     * 提交
     */
    public abstract commit(): Promise<void>;

    /**
     * 注册提交后函数
     * 
     * @param action 函数
     */
    public registerAfter(action: () => Promise<void>) {
        this.afterActions.push(action);
    }

    /**
     * 注册新增
     * 
     * @param table 表
     * @param entry 实体
     */
    public abstract registerAdd(table: string, entry: any): void;

    /**
     * 注册删除
     * 
     * @param table 表
     * @param entry 实体
     */
    public abstract registerRemove(table: string, entry: any): void;

    /**
     * 注册更新
     * 
     * @param table 表
     * @param entry 实体
     */
    public abstract registerSave(table: string, entry: any): void;
}