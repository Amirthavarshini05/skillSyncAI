import urllib.request
import urllib.error

body = b'--bnd\r\nContent-Disposition: form-data; name="file"; filename="test.pdf"\r\nContent-Type: application/pdf\r\n\r\nfake pdf content\r\n--bnd--\r\n'

req = urllib.request.Request('http://localhost:8000/api/users/me/resume', data=body, method='POST')
req.add_header('Content-Type', 'multipart/form-data; boundary=bnd')
req.add_header('Origin', 'http://localhost:5173')

try:
    urllib.request.urlopen(req)
except urllib.error.HTTPError as e:
    print('HTTPError:', e.code, e.read())
except Exception as e:
    print('Error:', type(e), e)
