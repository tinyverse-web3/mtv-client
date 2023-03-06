export const config = {
     kv:{
        'key_server_url': import.meta.env.VITE_KEY_SERVER_URL,
        'set_key_url': import.meta.env.VITE_KEY_SET_API,
        'get_key_url': import.meta.env.VITE_KEY_GET_API,
        'qasks_api_key': import.meta.env.VITE_KEY_QASKS_API_KEY,
        'qasks_api_secret_key': import.meta.env.VITE_KEY_QASKS_API_SECRET_KEY
    }
}