// @ts-nocheck

export function getRkey(record: any) {
  return record.uri.split('/').splice(-1)[0]
}
