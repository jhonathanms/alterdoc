export const appConstants = {
    REGEX_VERIFICA_NOTACAO_NOTE: /^:+\s*(note)?\s*/i,
    REGEX_VERIFICA_NOTACAO_WARNING: /^:+\s*(warning)?\s*/i,
    REGEX_VERIFICA_NOTACAO_NOTE_OU_WARNING: /^:+\s*(note|warning)\s*/i,
    REGEX_VERIFICA_NOTACAO_NOTE_FECHAMENTO: /^:+\s*/,
    REGEX_VERIFICA_NOTACAO_NOTE_TITULO: /^:+\s*note\s*/i,
    REGEX_IS_TITULO_ENDPOINT: /^.*\[\/+.*\]$/,
    REGEX_IS_TITULO_ENDPOINT_COMPLETO: /^##\s*(.+?)\s*\[\s*(\/.+?)\s*\]$/,
    REGEX_IS_TITULO_REQUEST: /^.*\[(POST|GET|PUT|DELETE|PATCH|OPTIONS|HEAD)\]$/,
    REGEX_IS_TABELA: /^\|?\s*:?-{1,}:?\s*(\|\s*:?-*:?\s*)+$/,
    REGEX_IS_PARAMETRO: /^\+\s*(\w+):\s*`(.+?)`\s*(?:\(([^)]+)\))?\s*-\s*(.*?)(?:\s*\+\s*Default:\s*`?([^`]+)`?)?$/,
    REGEX_IS_STRONG_BLUEPRINT: /\*\*(.*?)\*\*/g,
    REGEX_IS_ITALIC_BLUEPRINT: /\*(.*?)\*/g,
    REGEX_IS_LINK_BLUEPRINT: /\[(.*?)\]\((.*?)\)/g,
    TEMPO_ESPERA_DEBOUNCE: 1000
}