(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{5557:function(n,e,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return t(8094)}])},8094:function(n,e,t){"use strict";t.r(e),t.d(e,{default:function(){return X}});var r=t(4051),a=t.n(r),o=t(5893),l=t(6306),u=t(2959),s=t(1889),_=t(8504),c=t(6713),d=t(4842),p=t(882),m={basic:{expr2:"program expr2\n    implicit none\n\n    integer :: x\n\n    x = (2+3)*5\n    print *, x\nend program",mandelbrot:'program mandelbrot\n    integer, parameter :: Nx = 600, Ny = 450, n_max = 255, dp=kind(0.d0)\n    real(dp), parameter :: xcenter = -0.5_dp, ycenter = 0.0_dp, &\n        width = 4, height = 3, dx_di = width/Nx, dy_dj = -height/Ny, &\n        x_offset = xcenter - (Nx+1)*dx_di/2, y_offset = ycenter - (Ny+1)*dy_dj/2\n    integer :: image(Nx,Ny), image_color(4,Nx,Ny), palette(3,4), i, j, n, idx\n    real(dp) :: x, y, x_0, y_0, x_sqr, y_sqr\n    interface\n        subroutine show_img(w, h, A) bind(js)\n        integer, intent(in) :: w, h\n        integer, intent(in) :: A(w,h)\n        end subroutine\n        subroutine show_img_color(w, h, A) bind(js)\n        integer, intent(in) :: w, h\n        integer, intent(in) :: A(4,w,h)\n        end subroutine\n    end interface\n    do j = 1, Ny\n        y_0 = y_offset + dy_dj * j\n        do i = 1, Nx\n            x_0 = x_offset + dx_di * i\n            x = 0; y = 0; n = 0\n            do\n                x_sqr = x ** 2; y_sqr = y ** 2\n                if (x_sqr + y_sqr > 4 .or. n == n_max) then\n                    image(i,j) = 255-n\n                    exit\n                end if\n                y = y_0 + 2 * x * y\n                x = x_0 + x_sqr - y_sqr\n                n = n + 1\n            end do\n        end do\n    end do\n    palette(1,1) =   0; palette(2,1) = 135; palette(3,1) =  68\n    palette(1,2) =   0; palette(2,2) =  87; palette(3,2) = 231\n    palette(1,3) = 214; palette(2,3) =  45; palette(3,3) =  32\n    palette(1,4) = 255; palette(2,4) = 167; palette(3,4) =   0\n    do j = 1, Ny\n        do i = 1, Nx\n            idx = image(i,j) - (image(i,j)/4)*4 + 1\n            image_color(1,i,j) = palette(1,idx) ! Red\n            image_color(2,i,j) = palette(2,idx) ! Green\n            image_color(3,i,j) = palette(3,idx) ! Blue\n            image_color(4,i,j) = 255            ! Alpha\n        end do\n    end do\n    print *, "The Mandelbrot image in color:"\n    call show_img_color(Nx, Ny, image_color)\n    print *, "The Mandelbrot image in grayscale:"\n    call show_img(Nx, Ny, image)\n    print *, "Done."\nend program mandelbrot'},experimental:{template_add:'module template_add_01_m\n    implicit none\n    private\n    public :: add_t\n\n    requirement R(T, F)\n        type, deferred :: T\n        function F(x, y) result(z)\n            type(T), intent(in) :: x, y\n            type(T) :: z\n        end function\n    end requirement\n\n    template add_t(T, F)\n        require :: R(T, F)\n        private\n        public :: add_generic\n    contains\n        function add_generic(x, y) result(z)\n            type(T), intent(in) :: x, y\n            type(T) :: z\n            z = F(x, y)\n        end function\n    end template\n\ncontains\n\n    real function func_arg_real(x, y) result(z)\n        real, intent(in) :: x, y\n        z = x + y\n    end function\n\n    integer function func_arg_int(x, y) result(z)\n        integer, intent(in) :: x, y\n        z = x + y\n    end function\n\n    subroutine test_template()\n        instantiate add_t(real, func_arg_real), only: add_real => add_generic\n        real :: x, y\n        integer :: a, b\n        x = 5.1\n        y = 7.2\n        print*, "The result is ", add_real(x, y)\n        if (abs(add_real(x, y) - 12.3) > 1e-5) error stop\n\n        instantiate add_t(integer, func_arg_int), only: add_integer => add_generic\n        a = 5\n        b = 9\n        print*, "The result is ", add_integer(a, b)\n        if (add_integer(a, b) /= 14) error stop\n    end subroutine\nend module\n\nprogram template_add_01\nuse template_add_01_m\nimplicit none\n\ncall test_template()\n\nend program',template_nested:'module template_nested_m\n    implicit none\n    private\n    public :: add_t\n\n    requirement R(T, F)\n        type, deferred :: T\n        function F(x, y) result(z)\n            type(T), intent(in) :: x, y\n            type(T) :: z\n        end function\n    end requirement\n\n    template add_t(T, F)\n        require :: R(T, F)\n        private\n        public :: add_generic\n    contains\n        function add_generic(x, y) result(z)\n            type(T), intent(in) :: x, y\n            type(T) :: z\n            z = F(x, y)\n        end function\n        function call_add_generic(x, y) result(z)\n            type(T), intent(in) :: x, y\n            type(T) :: z\n            z = add_generic(x, y)\n        end function\n    end template\n\ncontains\n\n    real function func_arg_real(x, y) result(z)\n        real, intent(in) :: x, y\n        z = x + y\n    end function\n\n    subroutine test_template()\n        instantiate add_t(real, func_arg_real), only: add_real => call_add_generic\n        real :: x, y\n        integer :: a, b\n        x = 5.1\n        y = 7.2\n        print*, "The result is ", add_real(x, y)\n        if (abs(add_real(x, y) - 12.3) > 1e-5) error stop\n    end subroutine\nend module\n\nprogram template_nested\nuse template_nested_m\nimplicit none\n\ncall test_template()\n\nend program template_nested',template_travel:'module template_travel_01_math\n\n    implicit none\n    private\n    public :: add_real, slash_real\n\ncontains\n\n    pure function add_real(x, y) result(total)\n        real, intent(in) :: x, y\n        real :: total\n        total = x + y\n    end function\n\n    pure function slash_real(x, y) result(total)\n        real, intent(in) :: x, y\n        real :: total\n        total = x / y\n    end function\n\nend module\n\nmodule template_travel_01_travel\n\n    use template_travel_01_math\n    implicit none\n    private\n    public :: travel_tmpl\n\n    requirement operations(D, T, S, plus_D, plus_T, D_divided_by_T, D_divided_by_S)\n        type, deferred :: D\n        type, deferred :: T\n        type, deferred :: S\n\n        pure function plus_D(l, r) result(total)\n            type(D), intent(in) :: l, R\n            type(D) :: total\n        end function\n\n        pure function plus_T(l, r) result(total)\n            type(T), intent(in) :: l, R\n            type(T) :: total\n        end function\n\n        pure function D_divided_by_T(n, d) result(quotient)\n            type(D), intent(in) :: n\n            type(T), intent(in) :: d\n            type(S) :: quotient\n        end function\n\n        pure function D_divided_by_S(n, d) result(quotient)\n            type(D), intent(in) :: n\n            type(S), intent(in) :: d\n            type(T) :: quotient\n        end function\n    end requirement\n\n    template travel_tmpl(D, T, S, plus_D, plus_T, D_divided_by_T, D_divided_by_S)\n        require :: operations(D, T, S, plus_D, plus_T, D_divided_by_T, D_divided_by_S)\n        private\n        public :: avg_S_from_T\n    contains\n        pure function avg_S_from_T(d1, t1, d2, t2) result(avg)\n            type(D), intent(in) :: d1, d2\n            type(T), intent(in) :: t1, t2\n            type(S) :: avg\n            avg = D_divided_by_T(plus_D(d1, d2), plus_T(t1, t2))\n        end function\n\n        pure function avg_S_from_S(d1, s1, d2, s2) result(avg)\n            type(D), intent(in) :: d1, d2\n            type(S), intent(in) :: s1, s2\n            type(S) :: avg\n            avg = avg_S_from_T(d1, D_divided_by_S(d1, s1), d2, D_divided_by_S(d2, s2))\n        end function\n    end template\n\nend module\n\nmodule template_travel_01_m\n\n    use template_travel_01_math\n    use template_travel_01_travel\n    implicit none\n\ncontains\n\n    subroutine test_template()\n        instantiate travel_tmpl(real, real, real, add_real, add_real, slash_real, slash_real), &\n            only: avg_real_S_from_T => avg_S_from_T\n        instantiate travel_tmpl(real, real, real, add_real, add_real, slash_real, slash_real), &\n            only: avg_real_S_from_S => avg_S_from_S\n        real :: s1, s2\n        s1 = avg_real_S_from_T(1.0, 3.0, 1.5, 4.0)\n        s2 = avg_real_S_from_S(1.1, 0.5, 2.0, 0.75)\n        print *, "s1=", s1\n        print *, "s2=", s2\n    end subroutine\n\nend module\n\nprogram template_travel_01\nuse template_travel_01_m\nimplicit none\n\ncall test_template()\n\nend program template_travel_01\n',template_triple:'module Math_integer_m\n\n    implicit none\n    private\n    public :: add_integer\n\n  contains\n\n    pure function add_integer(x, y) result(result)\n      integer, intent(in) :: x, y\n      integer :: result\n      result = x + y\n    end function\n\n    pure function minus_integer(x, y) result(result)\n      integer, intent(in) :: x, y\n      integer :: result\n      result = x - y\n    end function\n\n    pure function max_integer(x, y) result(result)\n      integer, intent(in) :: x, y\n      integer :: result\n      result = max(x, y)\n    end function\n\n    pure function min_integer(x, y) result(result)\n      integer, intent(in) :: x, y\n      integer :: result\n      result = min(x, y)\n    end function\n\n    pure function zero_integer() result(result)\n      integer :: result\n      result = 0\n    end function\n\n    pure function one_integer() result(result)\n      integer :: result\n      result = 1\n    end function\n\n  end module\n\n  module Math_real_m\n\n    implicit none\n    private\n    public :: add_real\n\n  contains\n\n    pure function add_real(x, y) result(result)\n      real, intent(in) :: x, y\n      real :: result\n      result = x + y\n    end function\n\n    pure function minus_real(x, y) result(result)\n      real, intent(in) :: x, y\n      real :: result\n      result = x - y\n    end function\n\n    pure function slash_real(x, y) result(result)\n      real, intent(in) :: x, y\n      real :: result\n      result = x / y\n    end function\n\n    pure function max_real(x, y) result(result)\n      real, intent(in) :: x, y\n      real :: result\n      result = max(x, y)\n    end function\n\n    pure function min_real(x, y) result(result)\n      real, intent(in) :: x, y\n      real :: result\n      result = min(x, y)\n    end function\n\n    pure function zero_real() result(result)\n      real :: result\n      result = 0.0\n    end function\n\n    pure function one_real() result(result)\n      real :: result\n      result = 1.0\n    end function\n\n  end module\n\n  module triple_m\n\n    implicit none\n    private\n    public :: triple_tmpl\n\n    requirement magma_r(T, plus_T)\n      type, deferred :: T\n\n      pure function plus_T(l, r) result(total)\n        type(T), intent(in) :: l, r\n        type(T) :: total\n      end function\n    end requirement\n\n    template triple_tmpl(T, plus_T)\n      require :: magma_r(T, plus_T)\n      private\n      public :: triple_l, triple_r\n    contains\n      pure function triple_l(t) result(result)\n        type(T), intent(in) :: t\n        type(T) :: result\n        result = plus_T(plus_T(t, t), t)\n      end function\n\n      pure function triple_r(t) result(result)\n        type(T), intent(in) :: t\n        type(T) :: result\n        result = plus_T(t, plus_T(t, t))\n      end function\n    end template\n\n  end module\n\n  module use_triple_m\n\n    use Math_integer_m\n    use Math_real_m\n    use triple_m\n\n  contains\n\n    subroutine test_add_triples()\n      instantiate triple_tmpl(integer, add_integer), &\n        only: triple_add_l => triple_l, &\n              triple_add_r => triple_r\n      integer :: tal, tar\n      tal = triple_add_l(7)\n      tar = triple_add_r(7)\n      print *, "tal = ", tal, " tar = ", tar\n    end subroutine\n\n    subroutine test_minus_triples()\n      instantiate triple_tmpl(real, minus_real), &\n        only: triple_minus_l => triple_l, &\n              triple_minus_r => triple_r\n      real :: tml, tmr\n      tml = triple_minus_l(7.0)\n      tmr = triple_minus_r(7.0)\n      print *, "tml = ", tml, " tmr = ", tmr\n    end subroutine\n\n    subroutine test_max_triples()\n      instantiate triple_tmpl(real, max_real), &\n        only: triple_max_l => triple_l, &\n              triple_max_r => triple_r\n      real :: tmaxl, tmaxr\n      tmaxl = triple_max_l(7.0)\n      tmaxr = triple_max_r(7.0)\n      print *, "tmaxl =", tmaxl, " tmaxr =", tmaxr\n    end subroutine\n\n  end module\n\n  program template_triple\n  use use_triple_m\n\n  call test_add_triples()\n  call test_minus_triples()\n  call test_max_triples()\n\n  end program template_triple',template_array_01b:"module template_array_01b_m\n\n    implicit none\n    private\n    public :: test_template\n\n    requirement r(t)\n        type, deferred :: t\n    end requirement\n\n    template array_tmpl(t)\n        require :: r(t)\n        private\n        public :: insert_t\n    contains\n        function insert_t(n, lst, i) result(r)\n            integer, intent(in) :: n\n            type(t), intent(in) :: lst(n), i\n            type(t) :: r\n            lst(1) = i\n            r = lst(1)\n        end function\n    end template\n\ncontains\n\n    subroutine test_template()\n        instantiate array_tmpl(integer), only: insert_int => insert_t\n        integer :: a(1), i, r\n        a(1) = 0\n        i = 1\n        print *, a(1)\n        r = insert_int(size(a), a, i)\n        print *, a(1)\n    end subroutine\n\nend module\n\nprogram template_array_01b\n\n    use template_array_01b_m\n    implicit none\n\n    call test_template()\n\nend",template_array_02b:"module template_array_02b_math\n\n    implicit none\n    private\n    public :: add_integer, zero_integer, add_real, zero_real\n\ncontains\n\n    pure function add_integer(x, y) result(r)\n        integer, intent(in) :: x, y\n        integer :: r\n        r = x + y\n    end function\n\n    pure function zero_integer(x) result(r)\n        integer, intent(in) :: x\n        integer :: r\n        r = 0\n    end function\n\n    pure function add_real(x, y) result(r)\n        real, intent(in) :: x, y\n        real :: r\n        r = x + y\n    end function\n\n    pure function zero_real(x) result(r)\n        real, intent(in) :: x\n        real :: r\n        r = 0\n    end function\n\nend module\n\nmodule template_array_02b_m\n\n    use template_array_02b_math\n    implicit none\n    private\n    public :: test_template\n\n    requirement operations(t, plus_t, zero_t)\n        type, deferred :: t\n\n        pure function plus_t(l, r) result(rs)\n            type(t), intent(in) :: l, r\n            type(t) :: rs\n        end function\n\n        pure function zero_t(l) result(rs)\n            type(t), intent(in) :: l\n            type(t) :: rs\n        end function\n    end requirement\n\n    template array_tmpl(t, plus_t, zero_t)\n        require :: operations(t, plus_t, zero_t)\n        private\n        public :: mysum_t\n    contains\n        function mysum_t(n, a) result(r)\n            integer, intent(in) :: n\n            type(t), intent(in) :: a(n)\n            type(t) :: r\n            integer :: i\n            r = zero_t(a(1))\n            do i = 1, size(a)\n                r = plus_t(r, a(i))\n            end do\n        end function\n    end template\n\ncontains\n\n    subroutine test_template()\n        instantiate array_tmpl(integer, add_integer, zero_integer), only: mysum_integer => mysum_t\n        integer :: a(10), i, s\n        do i = 1, size(a)\n            a(i) = i\n        end do\n        s = mysum_integer(size(a), a)\n        print *, s\n    end subroutine\n\nend module\n\nprogram template_array_02b\n\n    use template_array_02b_m\n    implicit none\n\n    call test_template()\n\nend",template_array_03:"module template_array_03_math\n\n    implicit none\n    private\n    public :: add_integer, zero_integer, add_real, zero_real, mult_integer, mult_real\n\ncontains\n\n    pure function add_integer(x, y) result(r)\n        integer, intent(in) :: x, y\n        integer :: r\n        r = x + y\n    end function\n\n    pure function zero_integer(x) result(r)\n        integer, intent(in) :: x\n        integer :: r\n        r = 0\n    end function\n\n    pure function mult_integer(x, y) result(r)\n        integer, intent(in) :: x, y\n        integer :: r\n        r = x * y\n    end function\n\n    pure function add_real(x, y) result(r)\n        real, intent(in) :: x, y\n        real :: r\n        r = x + y\n    end function\n\n    pure function zero_real(x) result(r)\n        real, intent(in) :: x\n        real :: r\n        r = 0\n    end function\n\n    pure function mult_real(x, y) result(r)\n        real, intent(in) :: x, y\n        real :: r\n        r = x * y\n    end function\n\nend module\n\nmodule template_array_03_m\n\n    use template_array_03_math\n    implicit none\n    private\n    public :: test_template\n\n    requirement operations(t, plus_t, zero_t, mult_t)\n\n        type, deferred :: t\n\n        pure function plus_t(l, r) result(result)\n            type(t), intent(in) :: l, r\n            type(t) :: result\n        end function\n\n        pure function zero_t(x) result(result)\n            type(t), intent(in) :: x\n            type(t) :: result\n        end function\n\n        pure function mult_t(l, r) result(result)\n            type(t), intent(in) :: l, r\n            type(t) :: result\n        end function\n\n    end requirement\n!\n    template array_tmpl(t, plus_t, zero_t, mult_t)\n\n        require :: operations(t, plus_t, zero_t, mult_t)\n        private\n        public :: mymatmul_t\n\n    contains\n\n        subroutine mymatmul_t(i, j, k, a, b, r)\n            integer, parameter, intent(in) :: i, j, k\n            type(t), intent(in) :: a(i,j), b(j,k)\n            type(t) :: r(i,k)\n            integer, parameter :: x = 1, y = 1, z = 1\n            type(t) :: elem\n            do x = 1, i\n                do z = 1, k\n                    elem = zero_t(a(1,1))\n                    do y = 1, j\n                        elem = plus_t(elem, mult_t(a(x,y), b(y,z)))\n                    end do\n                    r(x,z) = elem\n                end do\n            end do\n        end subroutine\n\n    end template\n\ncontains\n\n    subroutine test_template()\n        integer :: arr(2,2)\n        integer :: r(2,2)\n        arr(1,1) = 1\n        arr(1,2) = 1\n        arr(2,1) = 0\n        arr(2,2) = 1\n        instantiate array_tmpl(integer, add_integer, zero_integer, mult_integer), &\n            only: mymatmul_int => mymatmul_t\n        call mymatmul_int(2, 2, 2, arr, arr, r)\n        print *, r(1,1)\n        print *, r(1,2)\n        print *, r(2,1)\n        print *, r(2,2)\n    end subroutine\n\nend module\n\nprogram template_array_03\n\n    use template_array_03_m\n    implicit none\n\n    call test_template()\n\nend",template_array_04:"module reverse_m\n    implicit none\n    private\n    public :: reverse_tmpl\n\n    requirement default_behavior(t)\n        type, deferred :: t\n    end requirement\n\n    template reverse_tmpl(t)\n        require :: default_behavior(t)\n        private\n        public :: reverse\n    contains\n        subroutine swap(x, y)\n            type(t), intent(inout) :: x, y\n            type(t) :: tmp\n            tmp = x\n            x = y\n            y = tmp\n        end subroutine\n\n        subroutine reverse(arr)\n            type(t), intent(inout) :: arr(:)\n            integer :: i, j\n            do i = 1, size(arr)/2\n                j = size(arr)+1-i\n                call swap(arr(i), arr(j))\n            end do\n        end subroutine\n    end template\n\ncontains\n\n    subroutine test_reverse()\n        instantiate reverse_tmpl(integer), &\n            only: ireverse => reverse\n        integer :: a(5)\n        a = [1,2,3,4,5]\n        call ireverse(a)\n        print *, a\n        if (a(1) /= 5) error stop\n        if (a(5) /= 1) error stop\n    end subroutine\n\nend module\n\nprogram main\nuse reverse_m\ncall test_reverse()\nend program"}},f=t(5152),y=t.n(f),g=l.Z.TabPane,x=y()(Promise.all([t.e(281),t.e(275),t.e(286)]).then(t.bind(t,2286)),{loadableGenerated:{webpack:function(){return[2286]}},ssr:!1});var h=function(n){var e=function(n){var e=function(e){t.push({key:e,label:e,onClick:function(){i(m[n][e]),f(e)}})},t=[];for(var r in m[n])e(r);v.push({key:n,label:n,children:t})},t=n.disabled,r=n.sourceCode,i=n.setSourceCode,a=n.exampleName,f=n.setExampleName,y=n.activeTab,h=n.handleUserTabChange,b=n.myHeight,v=[];for(var T in m)e(T);var w=(0,o.jsx)(u.Z,{items:v}),S={right:(0,o.jsxs)(s.Z,{disabled:t,onClick:function(){return h(y)},children:[" ",(0,o.jsx)(d.Z,{})," Run "]}),left:(0,o.jsx)(_.Z,{overlay:w,trigger:"hover",children:(0,o.jsx)("a",{onClick:function(n){return n.preventDefault()},children:(0,o.jsxs)(c.Z,{style:{marginRight:"10px"},children:["Examples ",(0,o.jsx)(p.Z,{})]})})})};return(0,o.jsx)("div",{className:"card-container",style:{height:"100%"},children:(0,o.jsx)(l.Z,{tabBarExtraContent:S,style:{height:"100%"},children:(0,o.jsx)(g,{tab:"".concat(a,".f90"),style:{height:b},children:(0,o.jsx)(x,{sourceCode:r,setSourceCode:i})},"1")})})},b=t(7132),v=t(5439);var T,w=function(n){var e=n.activeTab,t=n.output,r=n.handleUserTabChange,i=n.myHeight,a=n.openNotification;return(0,o.jsxs)("div",{className:"card-container",children:[(0,o.jsx)(v.Z,{block:!0,style:{margin:"6px 0px 22px 0px"},options:["STDOUT","AST","ASR","WAT","CPP","PY"],value:e,onChange:function(n){return r(n)}}),(0,o.jsx)(s.Z,{onClick:function(){var n=(new DOMParser).parseFromString(t,"text/html");navigator.clipboard.writeText(n.documentElement.textContent),a("".concat(e," output copied"),"bottomRight")},style:{position:"absolute",right:"40px",top:"80px"},children:(0,o.jsx)(b.Z,{})}),(0,o.jsx)("pre",{style:{margin:"0px",height:i,overflow:"scroll",border:"1px solid black"},children:(0,o.jsx)("div",{id:"outputBox",style:{minHeight:"100%",fontSize:"0.9em",padding:"10px"},dangerouslySetInnerHTML:{__html:t}})})]})},S=t(4298),j=t.n(S),z=t(1163),R=t(7294);function E(n,e,t,r,i,a,o){try{var l=n[a](o),u=l.value}catch(s){return void t(s)}l.done?e(u):Promise.resolve(u).then(r,i)}function D(n){return function(){var e=this,t=arguments;return new Promise((function(r,i){var a=n.apply(e,t);function o(n){E(a,r,i,o,l,"next",n)}function l(n){E(a,r,i,o,l,"throw",n)}o(void 0)}))}}function N(){return new Promise((function(n,e){Module.onRuntimeInitialized=function(){n({emit_ast_from_source:Module.cwrap("emit_ast_from_source","string",["string"]),emit_asr_from_source:Module.cwrap("emit_asr_from_source","string",["string"]),emit_wat_from_source:Module.cwrap("emit_wat_from_source","string",["string"]),emit_cpp_from_source:Module.cwrap("emit_cpp_from_source","string",["string"]),emit_py_from_source:Module.cwrap("emit_wat_from_source","string",["string"]),emit_wasm_from_source:Module.cwrap("emit_wasm_from_source","string",["string"])})}}))}function k(n,e,t){var r=function(){t(n.join("")),n.length=0};return{wasi_snapshot_preview1:{fd_write:function(e,t,r,i){var a=new DataView(T.buffer,t,2*Int32Array.BYTES_PER_ELEMENT),o=a.getInt32(0,!0),l=a.getInt32(4,!0),u=new TextDecoder("utf8").decode(new Uint8Array(T.buffer,o,l));return n.push(u),0},proc_exit:function(n){return e.val=n}},js:{cpu_time:function(n){return Date.now()/1e3},show_img:function(e,t,i){var a=new DataView(T.buffer,i,Int32Array.BYTES_PER_ELEMENT*t*e),o=document.createElement("CANVAS");o.width=e,o.height=t;for(var l=o.getContext("2d"),u=l.createImageData(e,t),s=0;s<u.data.length;s+=4)u.data[s+0]=a.getInt32(s,!0),u.data[s+1]=a.getInt32(s,!0),u.data[s+2]=a.getInt32(s,!0),u.data[s+3]=255;l.putImageData(u,0,0),n.push('<img alt="constructed image" src="'.concat(o.toDataURL("image/jpeg"),'" height="').concat(t,'" width="').concat(e,'" style="aspect-ratio: 1 / 1;"/>\n')),r()},show_img_color:function(e,t,i){var a=new DataView(T.buffer,i,4*Int32Array.BYTES_PER_ELEMENT*t*e),o=document.createElement("CANVAS");o.width=e,o.height=t;for(var l=o.getContext("2d"),u=l.createImageData(e,t),s=0;s<u.data.length;s++)u.data[s]=a.getInt32(4*s,!0);l.putImageData(u,0,0),n.push('<img alt="constructed image" src="'.concat(o.toDataURL("image/jpeg"),'" height="').concat(t,'" width="').concat(e,'" style="aspect-ratio: 1 / 1;"/>\n')),r()}}}}function q(n,e){return C.apply(this,arguments)}function C(){return C=D(a().mark((function n(e,t){var r;return a().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,N();case 2:r=n.sent,e.emit_ast_from_source=function(n){try{return r.emit_ast_from_source(n)}catch(e){return console.log(e),t(e+"\nERROR: AST could not be generated from the code"),0}},e.emit_asr_from_source=function(n){try{return r.emit_asr_from_source(n)}catch(e){return console.log(e),t(e+"\nERROR: ASR could not be generated from the code"),0}},e.emit_wat_from_source=function(n){try{return r.emit_wat_from_source(n)}catch(e){return console.log(e),t(e+"\nERROR: WAT could not be generated from the code"),0}},e.emit_cpp_from_source=function(n){try{return r.emit_cpp_from_source(n)}catch(e){return console.log(e),t(e+"\nERROR: CPP could not be generated from the code"),0}},e.emit_py_from_source=function(n){try{return r.emit_py_from_source(n)}catch(e){return console.log(e),t(e+"\nERROR: LLVM could not be generated from the code"),0}},e.compile_code=function(n){try{return r.emit_wasm_from_source(n)}catch(e){return console.log(e),t(e+"\nERROR: The code could not be compiled. Either there is a compile-time error or there is an issue at our end."),0}},e.execute_code=function(){var n=D(a().mark((function n(e,t){var r,i,o,l,u,s,_;return a().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return o=k(i=[],r={val:1},t),s=function(){var n=u-l,e=sessionStorage.getItem("duration_compile");i.push("\nCompilation time: ".concat(e," ms")),i.push("\nExecution time: ".concat(n," ms")),t(i.join(""))},n.prev=5,n.next=8,WebAssembly.instantiate(e,o);case 8:_=n.sent,T=_.instance.exports.memory,l=performance.now(),_.instance.exports._start(),u=performance.now(),s(),n.next=24;break;case 16:if(n.prev=16,n.t0=n.catch(5),u=performance.now(),s(),0!=r.val){n.next=22;break}return n.abrupt("return");case 22:console.log(n.t0),t("\n".concat(n.t0,"\nERROR: The code could not be executed. Either there is a runtime error or there is an issue at our end."));case 24:case"end":return n.stop()}}),n,null,[[5,16]])})));return function(e,t){return n.apply(this,arguments)}}();case 10:case"end":return n.stop()}}),n)}))),C.apply(this,arguments)}var A=function(n){var e=n.moduleReady,t=n.setModuleReady,r=n.lfortran_funcs,i=n.openNotification,l=n.myPrint,u=(0,z.useRouter)().basePath;(0,R.useEffect)((function(){return window.Module={locateFile:function(n){return"".concat(u,"/").concat(n)}},function(){window.Module=null}}),[u]);var s=(0,R.useCallback)(D(a().mark((function n(){return a().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,q(r,l);case 2:t(!0),i("LFortran Module Initialized!","bottomRight"),console.log("LFortran Module Initialized!");case 5:case"end":return n.stop()}}),n)}))),[e]);return(0,o.jsx)("div",{children:(0,o.jsx)(j(),{src:"".concat(u,"/lfortran.js"),onLoad:s})})};var M=t(6317),P=t(6226),I=t(1382),U=t(9614),Z=t(888),O=t(4431);function F(n,e){(null==e||e>n.length)&&(e=n.length);for(var t=0,r=new Array(e);t<e;t++)r[t]=n[t];return r}function L(n,e,t,r,i,a,o){try{var l=n[a](o),u=l.value}catch(s){return void t(s)}l.done?e(u):Promise.resolve(u).then(r,i)}function B(n){return function(){var e=this,t=arguments;return new Promise((function(r,i){var a=n.apply(e,t);function o(n){L(a,r,i,o,l,"next",n)}function l(n){L(a,r,i,o,l,"throw",n)}o(void 0)}))}}function H(n){return function(n){if(Array.isArray(n))return n}(n)||function(n){if("undefined"!==typeof Symbol&&null!=n[Symbol.iterator]||null!=n["@@iterator"])return Array.from(n)}(n)||function(n,e){if(!n)return;if("string"===typeof n)return F(n,e);var t=Object.prototype.toString.call(n).slice(8,-1);"Object"===t&&n.constructor&&(t=n.constructor.name);if("Map"===t||"Set"===t)return Array.from(t);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return F(n,e)}(n,i)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var V=new(t.n(O)()),Y=(0,o.jsx)(Z.Z,{style:{fontSize:24},spin:!0}),W=function(n,e){U.Z.info({message:n,placement:e})},G={emit_ast_from_source:null,emit_asr_from_source:null,emit_wat_from_source:null,emit_wasm_from_source:null,emit_cpp_from_source:null,emit_py_from_source:null,compile_code:null,execute_code:null};function X(){var n=(0,R.useState)(!1),e=n[0],t=n[1],r=(0,R.useState)(""),i=r[0],l=r[1],u=(0,R.useState)("main"),s=u[0],_=u[1],c=(0,R.useState)("STDOUT"),d=c[0],p=c[1],f=(0,R.useState)(""),y=f[0],g=f[1],x=(0,R.useState)(!1),b=x[0],v=x[1],T=function(){var n=(0,R.useState)(!1),e=n[0],t=n[1];return(0,R.useEffect)((function(){var n=function(){var n=window.innerWidth<768;t(n)};return n(),window.addEventListener("resize",n),function(){window.removeEventListener("resize",n)}}),[]),e}()?"calc(50vh - 85px)":"calc(100vh - 170px)";function S(){return(S=B(a().mark((function n(){var e,t,r;return a().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:e=window.location.search,"https://gist.githubusercontent.com/",(t=new URLSearchParams(e)).get("code")?(l(decodeURIComponent(t.get("code"))),v(!0)):t.get("gist")?(r="https://gist.githubusercontent.com/"+t.get("gist")+"/raw/",fetch(r,{cache:"no-store"}).then((function(n){return n.text()})).then((function(n){l(n),v(!0),W("Source Code loaded from gist.","bottomRight")})).catch((function(n){console.error("Error fetching data:",n),W("error fetching .","bottomRight")}))):(l(m.basic.mandelbrot),v(!0),t.size>0&&W("The URL contains an invalid parameter.","bottomRight"));case 4:case"end":return n.stop()}}),n)})))).apply(this,arguments)}function j(n){return z.apply(this,arguments)}function z(){return(z=B(a().mark((function n(e){var t,r,o,l,u,s,_,c,d,m,f,y;return a().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:if("STDOUT"!=e){n.next=23;break}if(""!==i.trim()){n.next=5;break}return g("No Source Code to compile"),p(e),n.abrupt("return");case 5:if(t=performance.now(),r=G.compile_code(i),o=performance.now(),l=o-t,sessionStorage.setItem("duration_compile",l),!r){n.next=21;break}if(u=H(r.split(",")),s=u[0],_=u.slice(1),"0"===s){n.next=16;break}g(V.ansi_to_html(_)+"\nCompilation Time: ".concat(l," ms")),n.next=21;break;case 16:return c=[],n.next=19,G.execute_code(new Uint8Array(_),(function(n){return c.push(n)}));case 19:n.sent,g(c.join(""));case 21:n.next=24;break;case 23:"AST"==e?(d=G.emit_ast_from_source(i))&&g(V.ansi_to_html(d)):"ASR"==e?(m=G.emit_asr_from_source(i))&&g(V.ansi_to_html(m)):"WAT"==e?(f=G.emit_wat_from_source(i))&&g(V.ansi_to_html(f)):"CPP"==e?(y=G.emit_cpp_from_source(i))&&g(V.ansi_to_html(y)):"PY"==e?g("Support for PY is not yet enabled"):(console.log("Unknown key:",e),g("Unknown key: "+e));case 24:p(e);case 25:case"end":return n.stop()}}),n)})))).apply(this,arguments)}return(0,R.useEffect)((function(){l(""),function(){S.apply(this,arguments)}()}),[]),(0,R.useEffect)((function(){e&&b&&j("STDOUT")}),[e,b]),(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(A,{moduleReady:e,setModuleReady:t,lfortran_funcs:G,openNotification:W,myPrint:g}),(0,o.jsxs)(M.Z,{gutter:[16,16],children:[(0,o.jsx)(P.Z,{xs:{span:24},sm:{span:24},md:{span:12},children:(0,o.jsx)(h,{disabled:!e,sourceCode:i,setSourceCode:l,exampleName:s,setExampleName:_,activeTab:d,handleUserTabChange:j,myHeight:T})}),(0,o.jsx)(P.Z,{xs:{span:24},sm:{span:24},md:{span:12},children:e?(0,o.jsx)(w,{activeTab:d,output:y,handleUserTabChange:j,myHeight:T,openNotification:W}):(0,o.jsx)("div",{style:{height:T},children:(0,o.jsx)(I.Z,{style:{position:"relative",top:"50%",left:"50%"},indicator:Y})})})]})]})}}},function(n){n.O(0,[334,774,888,179],(function(){return e=5557,n(n.s=e);var e}));var e=n.O();_N_E=e}]);