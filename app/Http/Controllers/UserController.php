<?php


namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\User;
use OpenApi\Annotations as OA;
use Illuminate\Support\Facades\Auth;
use Lcobucci\JWT\Parser;
use Symfony\Component\HttpFoundation\Response as ResponseHTTP;

/**
  @OA\Info(
      description="Swagger User Api On QuoTeam",
      version="1.0.0",
      title="User Login API",
      @OA\Contact(
          email="support@quo-global.com",
          name="Quo Global Swagger API Team",
          url="https://swagger.quo-global.com"
      )
 )
 */


/**
 @OA\Schema()
 */

class AccountController extends Controller
{

    /**
      @OA\Property(property="token", type="string", description="The CSRF token required")
     */
    public $token;

    public function login(Request $request)
    {

        /**
        @OA\Post(
            path="/api/user/login",
            tags={"Login"},
            summary="Login",
            operationId="login",

            @OA\Parameter(
                name="email",
                in="query",
                required=true,

                @OA\Schema(
                    type="string"
                )
            ),
            @OA\Parameter(
                name="password",
                in="query",
                required=true,

                @OA\Schema(
                    type="string"
                )
            ),
            @OA\Response(
                response=200,
                description="Success! Return token login",

                @OA\MediaType(
                    mediaType="application/json",
                ),
                @OA\Schema(
                    type="object",
                    allOf={
                        @OA\Schema(
                            @OA\Property(property="id", format="int64", type="integer"),
                            @OA\Property(property="email", type="string"),
                            @OA\Property(property="password", type="string"),
                            @OA\Property(property="token", type="string")
                        )
                    }
                )
            ),

        )
         */


        $payload = array();
        $message = null;

        try{
            $validator = Validator::make($request->all(), [
                'email' => 'required',
                'password' => 'required',
            ]);
            if($validator->$validator->fails()){
                $payload = [
                    'status' => ResponseHTTP::HTTP_OK,
                    'data' => $request->all()
                ];
                $message = 'Auth Success!';
            }else{
                $payload = [
                    'status' => ResponseHTTP::HTTP_NOT_FOUND,
                    'data' => null
                ];
                $message = 'Auth Not Found!';
            }
            return $this->APIResponse->respondWithMessageAndPayload($payload, $message);
        }catch($e){
            return $this->APIResponse->handleAndResponseException($e);
        }
    }

    public function logout(Request $resquest): void
    {
        /**
            @OA\Get(
                path="/api/user/logout",
                tags={"LogOut"},
                summary="LogOut",
                operationId="LogOut",

                @OA\Parameter(
                    name="token",
                    in="query",
                    required=true,

                        @OA\Schema(
                        type="string"
                    )
                ),
         *
                @OA\Response(
                    response=200,
                    description="Success",

                    @OA\MediaType(
                        mediaType="application/json",
                    )
                )
            )
         */
    }

    public function register(Request $request)
    {
        /**
            @OA\Post(
                path="/api/user/register",
                tags={"Register"},
                summary="Register",
                operationId="register",

            @OA\RequestBody(
                  @OA\MediaType(
                      mediaType="application/json",
                      @OA\Schema(
                          @OA\Property(
                              property="id",
                              type="string"
                          ),
                          @OA\Property(
                              property="name",
                              type="string"
                          ),
                          example={"id": 10, "name": "Jessica Smith"}
                      )
                  )
            ),
            @OA\Parameter(
                name="token",
                in="query",
                required=true,

                @OA\Schema(
                    type="string"
                )
            ),
            @OA\Response(
                response=200,
                description="Success",
                    @OA\MediaType(
                        mediaType="application/json",
                        @OA\Schema(
                            @OA\Property(
                                property="id",
                                type="string"
                            ),
                            @OA\Property(
                                property="name",
                                type="string"
                            ),
                            example={"id": 10, "name": "Jessica Smith"}
                        )
                    )
                ),

            )
        */

        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required',
                'password' => 'required',
            ]);

            $data = [];

            if ($validator->fails()) {
                $errors = $validator->errors();
                foreach ($errors->all() as $field => $validationMessage) {
                    $data['error'][] = $validationMessage;
                }
                $success = [
                    'status' => ResponseHTTP::HTTP_BAD_REQUEST,
                    'data' => $data
                ];
                $message = 'Validation failed!.';
            } else {
                if (Auth::guard()->attempt(['email' => request('email'), 'password' => request('password')])) {
                    $user = Auth::user()->select('id', 'first_name', 'last_name', 'email', 'avatar', 'referral_code')->where('id', Auth::id())->get()->first();

                    $data['token'] = $user->createToken('MyApp')->accessToken;
                    $data['user'] = $user;

                    $success = [
                        'status' => ResponseHTTP::HTTP_OK,
                        'data' => $data,
                    ];

                    $message = 'Login successfull!.';

                    //store device information
                    UserDevice::addUserDevices($request, $user, config('constants.status.active'));
                } else {
                    $success = [
                        'status' => ResponseHTTP::HTTP_BAD_REQUEST,
                    ];
                    $message = 'Invalid Email or Password!.';

                }
            }

            return $this->APIResponse->respondWithMessageAndPayload($success, $message);
        } catch (\Exception $e) {
            return $this->APIResponse->handleAndResponseException($e);
        }
    }


}
