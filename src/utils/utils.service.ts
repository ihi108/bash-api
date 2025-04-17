import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilsService {

    private alphabet: string = "abcdefghijmklmnopqrstuvwxyz";

    randomString(n: number): string {
        const String: string[] = []
        const k:number = this.alphabet.length

        for (let i=0; i < n; i++) {
            String[i] = this.alphabet[Math.floor(Math.random() * 27)]
        }

        return String.join('')
    }

    constantBalance(): number {
        return 500;
    }
}
