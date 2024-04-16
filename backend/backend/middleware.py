class TokenCookieMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if "token" in request.COOKIES:
            token = request.COOKIES["token"]
            request.META["Authorization"] = "Bearer " + token

        response = self.get_response(request)
        return response
