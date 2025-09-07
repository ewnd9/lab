import querystring from 'node:querystring';
import axios from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { env } from '../../env';

const agent = env.SOCKS5_PROXY ? new SocksProxyAgent(env.SOCKS5_PROXY) : null;
const instagramClient = axios.create({
  baseURL: 'https://www.instagram.com',
  ...(agent ? { httpAgent: agent, httpsAgent: agent } : {}),
});

// https://github.com/Okramjimmy/Instagram-reels-downloader/blob/01e8fcb3a6288136d79bd1712bcf0151301603ae/src/services/instagram/requests.ts#L33
export async function parseInstagramPost({ postId }: { postId: string }): Promise<any> {
  const encodedData = encodeGraphqlRequestData(postId);

  const { data } = await instagramClient.post('/api/graphql', encodedData, {
    headers: {
      Accept: '*/*',
      'Accept-Language': 'en-US,en;q=0.5',
      'Content-Type': 'application/x-www-form-urlencoded',
      'X-FB-Friendly-Name': 'PolarisPostActionLoadPostQueryQuery',
      'X-CSRFToken': 'RVDUooU5MYsBbS1CNN3CzVAuEP8oHB52',
      'X-IG-App-ID': '1217981644879628',
      'X-FB-LSD': 'AVqbxe3J_YA',
      'X-ASBD-ID': '129477',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-origin',
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36',
    },
    timeout: 30000,
  });

  if (data.errors?.[0]?.message) {
    throw new Error(data.errors[0].message);
  }

  // const { inspect } = await import('node:util');
  // console.log(inspect({ postId, data }, { showHidden: false, depth: null }));
  // console.log(data);
  // (await import('fs')).writeFileSync('data.json', JSON.stringify(data, null, 2));

  return {
    videoUrl: data.data.xdt_shortcode_media.video_url,
    thumbnailSrc: data.data.xdt_shortcode_media.thumbnail_src,
    displayUrl: data.data.xdt_shortcode_media.display_url,
    owner: {
      id: data.data.xdt_shortcode_media.owner.id,
      username: data.data.xdt_shortcode_media.owner.username,
      fullName: data.data.xdt_shortcode_media.owner.full_name,
    },
    description: data.data.xdt_shortcode_media.edge_media_to_caption.edges[0]?.node.text || '',
  };
}

// https://github.com/Okramjimmy/Instagram-reels-downloader/blob/01e8fcb3a6288136d79bd1712bcf0151301603ae/src/features/instagram/utils.ts#L114
export function encodeGraphqlRequestData(shortcode: string) {
  const requestData = {
    av: '0',
    __d: 'www',
    __user: '0',
    __a: '1',
    __req: '3',
    __hs: '19624.HYP:instagram_web_pkg.2.1..0.0',
    dpr: '3',
    __ccg: 'UNKNOWN',
    __rev: '1008824440',
    __s: 'xf44ne:zhh75g:xr51e7',
    __hsi: '7282217488877343271',
    __dyn:
      '7xeUmwlEnwn8K2WnFw9-2i5U4e0yoW3q32360CEbo1nEhw2nVE4W0om78b87C0yE5ufz81s8hwGwQwoEcE7O2l0Fwqo31w9a9x-0z8-U2zxe2GewGwso88cobEaU2eUlwhEe87q7-0iK2S3qazo7u1xwIw8O321LwTwKG1pg661pwr86C1mwraCg',
    __csr:
      'gZ3yFmJkillQvV6ybimnG8AmhqujGbLADgjyEOWz49z9XDlAXBJpC7Wy-vQTSvUGWGh5u8KibG44dBiigrgjDxGjU0150Q0848azk48N09C02IR0go4SaR70r8owyg9pU0V23hwiA0LQczA48S0f-x-27o05NG0fkw',
    __comet_req: '7',
    lsd: 'AVqbxe3J_YA',
    jazoest: '2957',
    __spin_r: '1008824440',
    __spin_b: 'trunk',
    __spin_t: '1695523385',
    fb_api_caller_class: 'RelayModern',
    fb_api_req_friendly_name: 'PolarisPostActionLoadPostQueryQuery',
    variables: JSON.stringify({
      shortcode: shortcode,
      fetch_comment_count: 'null',
      fetch_related_profile_media_count: 'null',
      parent_comment_count: 'null',
      child_comment_count: 'null',
      fetch_like_count: 'null',
      fetch_tagged_user_count: 'null',
      fetch_preview_comment_count: 'null',
      has_threaded_comments: 'false',
      hoisted_comment_id: 'null',
      hoisted_reply_id: 'null',
    }),
    server_timestamps: 'true',
    doc_id: '10015901848480474',
  };
  const encoded = querystring.stringify(requestData);
  return encoded;
}
