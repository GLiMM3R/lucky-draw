import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class LanguageService {
    constructor(private readonly i18n: I18nService) {}

    USERNAME_EXIST(param?: string): string {
        return this.i18n.t('exception.USERNAME_EXIST', {
            args: { username: param ?? 'username' },
            lang: I18nContext.current().lang,
        });
    }

    USER_NOT_FOUND(): string {
        return this.i18n.t('exception.USER_NOT_FOUND', {
            lang: I18nContext.current().lang,
        });
    }

    TOKEN_INVALID(): string {
        return this.i18n.t('exception.TOKEN_INVALID', {
            lang: I18nContext.current().lang,
        });
    }

    CREDENTIAL_TAKEN(): string {
        return this.i18n.t('exception.CREDENTIAL_TAKEN', {
            lang: I18nContext.current().lang,
        });
    }

    CREDENTIAL_NOT_MATCH(): string {
        return this.i18n.t('exception.CREDENTIAL_NOT_MATCH', {
            lang: I18nContext.current().lang,
        });
    }
}
