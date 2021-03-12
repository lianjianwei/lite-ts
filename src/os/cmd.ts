import { spawn, SpawnOptionsWithoutStdio } from 'child_process';

import { CmdBase } from './cmd-base';

export class OSCmd extends CmdBase {
    public async exec(name: string, ...args: any[]): Promise<string> {
        const opt: SpawnOptionsWithoutStdio = {};
        if (this.dir)
            opt.cwd = this.dir;
        if (this.ms)
            opt.timeout = this.ms;

        const child = spawn(name, args, opt);
        let bf: string[] = [];

        child.stderr.setEncoding('utf8').on('data', chunk => {
            if (this.ignoreReturn)
                return;

            bf.push(
                chunk.toString()
            );
        });

        child.stdout.setEncoding('utf8').on('data', chunk => {
            if (this.ignoreReturn)
                return;

            bf.push(
                chunk.toString()
            );
        });

        return new Promise((s, f) => {
            child.on('error', f);

            child.on('exit', code => {
                this.reset();

                if (code === 0) {
                    s(
                        bf.join('')
                    );
                } else {
                    const message = JSON.stringify({
                        cmd: [name, ...args].join(' '),
                        code: code,
                        stderr: bf.join(''),
                    });
                    f(
                        new Error(message)
                    );
                }
            });
        });
    }
}