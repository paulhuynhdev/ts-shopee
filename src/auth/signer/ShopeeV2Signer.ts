import { createHmac } from 'crypto';
import { SignerPort, SignatureParams } from '../../shared/ports/SignerPort';

export class ShopeeV2Signer implements SignerPort {
  sign(params: SignatureParams): string {
    const { partnerId, partnerKey, path, timestamp, accessToken, shopId } = params;

    if (!accessToken) {
      const baseString = `${partnerId}${path}${timestamp}`;
      return createHmac('sha256', partnerKey).update(baseString).digest('hex');
    }

    const baseString = `${partnerId}${path}${timestamp}${accessToken}${shopId}`;
    return createHmac('sha256', partnerKey).update(baseString).digest('hex');
  }
}
