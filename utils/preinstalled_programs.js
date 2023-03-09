var preinstalled_programs = {
    basic: {
        expr2 : `program expr2
    implicit none

    integer :: x

    x = (2+3)*5
    print *, x
end program`,
    mandelbrot: `program mandelbrot
    integer, parameter :: Nx = 600, Ny = 450, n_max = 255, dp=kind(0.d0)
    real(dp), parameter :: xcenter = -0.5_dp, ycenter = 0.0_dp, &
        width = 4, height = 3, dx_di = width/Nx, dy_dj = -height/Ny, &
        x_offset = xcenter - (Nx+1)*dx_di/2, y_offset = ycenter - (Ny+1)*dy_dj/2
    integer :: image(Nx,Ny), image_color(4,Nx,Ny), palette(3,4), i, j, n, idx
    real(dp) :: x, y, x_0, y_0, x_sqr, y_sqr
    interface
        subroutine show_img(w, h, A) bind(c)
        integer, intent(in) :: w, h
        integer, intent(in) :: A(w,h)
        end subroutine
        subroutine show_img_color(w, h, A) bind(c)
        integer, intent(in) :: w, h
        integer, intent(in) :: A(4,w,h)
        end subroutine
    end interface
    do j = 1, Ny
        y_0 = y_offset + dy_dj * j
        do i = 1, Nx
            x_0 = x_offset + dx_di * i
            x = 0; y = 0; n = 0
            do
                x_sqr = x ** 2; y_sqr = y ** 2
                if (x_sqr + y_sqr > 4 .or. n == n_max) then
                    image(i,j) = 255-n
                    exit
                end if
                y = y_0 + 2 * x * y
                x = x_0 + x_sqr - y_sqr
                n = n + 1
            end do
        end do
    end do
    palette(1,1) =   0; palette(2,1) = 135; palette(3,1) =  68
    palette(1,2) =   0; palette(2,2) =  87; palette(3,2) = 231
    palette(1,3) = 214; palette(2,3) =  45; palette(3,3) =  32
    palette(1,4) = 255; palette(2,4) = 167; palette(3,4) =   0
    do j = 1, Ny
        do i = 1, Nx
            idx = image(i,j) - (image(i,j)/4)*4 + 1
            image_color(1,i,j) = palette(1,idx) ! Red
            image_color(2,i,j) = palette(2,idx) ! Green
            image_color(3,i,j) = palette(3,idx) ! Blue
            image_color(4,i,j) = 255            ! Alpha
        end do
    end do
    print *, "The Mandelbrot image in color:"
    call show_img_color(Nx, Ny, image_color)
    print *, "The Mandelbrot image in grayscale:"
    call show_img(Nx, Ny, image)
    print *, "Done."
end program mandelbrot`
    },
    experimental: {
        template_add: `module template_add_m
    implicit none
    private
    public :: add_t

    requirement R(T, F)
        type :: T; end type
        function F(x, y) result(z)
            type(T), intent(in) :: x, y
            type(T) :: z
        end function
    end requirement

    template add_t(T, F)
        requires R(T, F)
        private
        public :: add_generic
    contains
        function add_generic(x, y) result(z)
            type(T), intent(in) :: x, y
            type(T) :: z
            z = F(x, y)
        end function
    end template

contains

    real function func_arg_real(x, y) result(z)
        real, intent(in) :: x, y
        z = x + y
    end function

    integer function func_arg_int(x, y) result(z)
        integer, intent(in) :: x, y
        z = x + y
    end function

    subroutine test_template()
        instantiate add_t(real, func_arg_real), only: add_real => add_generic
        real :: x, y
        integer :: a, b
        x = 5.1
        y = 7.2
        print*, "The result is ", add_real(x, y)
        if (abs(add_real(x, y) - 12.3) > 1e-5) error stop

        instantiate add_t(integer, func_arg_int), only: add_integer => add_generic
        a = 5
        b = 9
        print*, "The result is ", add_integer(a, b)
        if (add_integer(a, b) /= 14) error stop
    end subroutine
end module

program template_add
use template_add_m
implicit none

call test_template()

end program template_add`,
    template_nested: `module template_nested_m
    implicit none
    private
    public :: add_t

    requirement R(T, F)
        type :: T; end type
        function F(x, y) result(z)
            type(T), intent(in) :: x, y
            type(T) :: z
        end function
    end requirement

    template add_t(T, F)
        requires R(T, F)
        private
        public :: add_generic
    contains
        function add_generic(x, y) result(z)
            type(T), intent(in) :: x, y
            type(T) :: z
            z = F(x, y)
        end function
        function call_add_generic(x, y) result(z)
            type(T), intent(in) :: x, y
            type(T) :: z
            z = add_generic(x, y)
        end function
    end template

contains

    real function func_arg_real(x, y) result(z)
        real, intent(in) :: x, y
        z = x + y
    end function

    subroutine test_template()
        instantiate add_t(real, func_arg_real), only: add_real => call_add_generic
        real :: x, y
        integer :: a, b
        x = 5.1
        y = 7.2
        print*, "The result is ", add_real(x, y)
        if (abs(add_real(x, y) - 12.3) > 1e-5) error stop
    end subroutine
end module

program template_nested
use template_nested_m
implicit none

call test_template()

end program template_nested`,
    template_travel: `module math

    implicit none
    private
    public :: add_real, slash_real

contains

    pure function add_real(x, y) result(total)
        real, intent(in) :: x, y
        real :: total
        total = x + y
    end function

    pure function slash_real(x, y) result(total)
        real, intent(in) :: x, y
        real :: total
        total = x / y
    end function

end module

module travel

    use math
    implicit none
    private 
    public :: travel_tmpl

    requirement operations(D, T, S, plus_D, plus_T, D_divided_by_T, D_divided_by_S)
        type :: D; end type
        type :: T; end type
        type :: S; end type

        pure function plus_D(l, r) result(total)
            type(D), intent(in) :: l, R
            type(D) :: total
        end function

        pure function plus_T(l, r) result(total)
            type(T), intent(in) :: l, R
            type(T) :: total
        end function

        pure function D_divided_by_T(n, d) result(quotient)
            type(D), intent(in) :: n
            type(T), intent(in) :: d
            type(S) :: quotient
        end function

        pure function D_divided_by_S(n, d) result(quotient)
            type(D), intent(in) :: n
            type(S), intent(in) :: d
            type(T) :: quotient
        end function
    end requirement

    template travel_tmpl(D, T, S, plus_D, plus_T, D_divided_by_T, D_divided_by_S)
        requires operations(D, T, S, plus_D, plus_T, D_divided_by_T, D_divided_by_S)
        private
        public :: avg_S_from_T
    contains
        pure function avg_S_from_T(d1, t1, d2, t2) result(avg)
            type(D), intent(in) :: d1, d2
            type(T), intent(in) :: t1, t2
            type(S) :: avg
            avg = D_divided_by_T(plus_D(d1, d2), plus_T(t1, t2))
        end function
        
        pure function avg_S_from_S(d1, s1, d2, s2) result(avg)
            type(D), intent(in) :: d1, d2
            type(S), intent(in) :: s1, s2
            type(S) :: avg
            avg = avg_S_from_T(d1, D_divided_by_S(d1, s1), d2, D_divided_by_S(d2, s2))
        end function
    end template

end module

module template_travel_m

    use math
    use travel
    implicit none

contains

    subroutine test_template()
        instantiate travel_tmpl(real, real, real, add_real, add_real, slash_real, slash_real), &
            only: avg_real_S_from_T => avg_S_from_T
        instantiate travel_tmpl(real, real, real, add_real, add_real, slash_real, slash_real), &
            only: avg_real_S_from_S => avg_S_from_S
        real :: s1, s2
        s1 = avg_real_S_from_T(1.0, 3.0, 1.5, 4.0)
        s2 = avg_real_S_from_S(1.1, 0.5, 2.0, 0.75)
        print *, "s1=", s1
        print *, "s2=", s2
    end subroutine

end module

program template_travel
use template_travel_m
implicit none

call test_template()

end program template_travel`,
    template_triple: `module Math_integer_m

    implicit none
    private
    public :: add_integer
  
  contains
  
    pure function add_integer(x, y) result(result)
      integer, intent(in) :: x, y
      integer :: result
      result = x + y
    end function
  
    pure function minus_integer(x, y) result(result)
      integer, intent(in) :: x, y
      integer :: result
      result = x - y
    end function
  
    pure function max_integer(x, y) result(result)
      integer, intent(in) :: x, y
      integer :: result
      result = max(x, y)
    end function
  
    pure function min_integer(x, y) result(result)
      integer, intent(in) :: x, y
      integer :: result
      result = min(x, y)
    end function
  
    pure function zero_integer() result(result)
      integer :: result
      result = 0
    end function
  
    pure function one_integer() result(result)
      integer :: result
      result = 1
    end function
  
  end module
  
  module Math_real_m
  
    implicit none
    private
    public :: add_real
  
  contains
  
    pure function add_real(x, y) result(result)
      real, intent(in) :: x, y
      real :: result
      result = x + y
    end function
  
    pure function minus_real(x, y) result(result)
      real, intent(in) :: x, y
      real :: result
      result = x - y
    end function
  
    pure function slash_real(x, y) result(result)
      real, intent(in) :: x, y
      real :: result
      result = x / y
    end function
  
    pure function max_real(x, y) result(result)
      real, intent(in) :: x, y
      real :: result
      result = max(x, y)
    end function
  
    pure function min_real(x, y) result(result)
      real, intent(in) :: x, y
      real :: result
      result = min(x, y)
    end function
  
    pure function zero_real() result(result)
      real :: result
      result = 0.0
    end function
  
    pure function one_real() result(result)
      real :: result
      result = 1.0
    end function
  
  end module
  
  module triple_m
  
    implicit none
    private
    public :: triple_tmpl
  
    requirement magma_r(T, plus_T)
      type :: T; end type
  
      pure function plus_T(l, r) result(total)
        type(T), intent(in) :: l, r
        type(T) :: total
      end function
    end requirement
  
    template triple_tmpl(T, plus_T)
      requires magma_r(T, plus_T)
      private
      public :: triple_l, triple_r
    contains
      pure function triple_l(t) result(result)
        type(T), intent(in) :: t
        type(T) :: result
        result = plus_T(plus_T(t, t), t)
      end function
      
      pure function triple_r(t) result(result)
        type(T), intent(in) :: t
        type(T) :: result
        result = plus_T(t, plus_T(t, t))
      end function
    end template
  
  end module
  
  module use_triple_m
  
    use Math_integer_m
    use Math_real_m
    use triple_m
  
  contains
  
    subroutine test_add_triples()
      instantiate triple_tmpl(integer, add_integer), &
        only: triple_add_l => triple_l, &
              triple_add_r => triple_r
      integer :: tal, tar
      tal = triple_add_l(7)
      tar = triple_add_r(7)
      print *, "tal = ", tal, " tar = ", tar
    end subroutine
  
    subroutine test_minus_triples()
      instantiate triple_tmpl(real, minus_real), &
        only: triple_minus_l => triple_l, &
              triple_minus_r => triple_r
      real :: tml, tmr
      tml = triple_minus_l(7.0)
      tmr = triple_minus_r(7.0)
      print *, "tml = ", tml, " tmr = ", tmr
    end subroutine
  
    subroutine test_max_triples()
      instantiate triple_tmpl(real, max_real), &
        only: triple_max_l => triple_l, &
              triple_max_r => triple_r
      real :: tmaxl, tmaxr
      tmaxl = triple_max_l(7.0)
      tmaxr = triple_max_r(7.0)
      print *, "tmaxl =", tmaxl, " tmaxr =", tmaxr
    end subroutine
  
  end module
  
  program template_triple
  use use_triple_m
  
  call test_add_triples()
  call test_minus_triples()
  call test_max_triples()
  
  end program template_triple`,
    template_array_01b: `module template_array_01b_m

    implicit none
    private
    public :: test_template

    requirement r(t)
        type :: t; end type
    end requirement

    template array_tmpl(t)
        requires r(t)
        private
        public :: insert_t
    contains
        function insert_t(n, lst, i) result(r)
            integer, intent(in) :: n
            type(t), intent(in) :: lst(n), i
            type(t) :: r
            lst(1) = i
            r = lst(1)
        end function
    end template

contains

    subroutine test_template()
        instantiate array_tmpl(integer), only: insert_int => insert_t
        integer :: a(1), i, r
        a(1) = 0
        i = 1
        print *, a(1)
        r = insert_int(size(a), a, i)
        print *, a(1)
    end subroutine

end module

program template_array_01b

    use template_array_01b_m
    implicit none

    call test_template()

end`,
    template_array_02b: `module template_array_02b_math

    implicit none
    private
    public :: add_integer, zero_integer, add_real, zero_real

contains

    pure function add_integer(x, y) result(r)
        integer, intent(in) :: x, y
        integer :: r
        r = x + y
    end function

    pure function zero_integer(x) result(r)
        integer, intent(in) :: x
        integer :: r
        r = 0
    end function

    pure function add_real(x, y) result(r)
        real, intent(in) :: x, y
        real :: r
        r = x + y
    end function

    pure function zero_real(x) result(r)
        real, intent(in) :: x
        real :: r
        r = 0
    end function

end module

module template_array_02b_m

    use template_array_02b_math
    implicit none
    private
    public :: test_template

    requirement operations(t, plus_t, zero_t)
        type :: t; end type

        pure function plus_t(l, r) result(rs)
            type(t), intent(in) :: l, r
            type(t) :: rs
        end function

        pure function zero_t(l) result(rs)
            type(t), intent(in) :: l
            type(t) :: rs
        end function
    end requirement

    template array_tmpl(t, plus_t, zero_t)
        requires operations(t, plus_t, zero_t)
        private
        public :: mysum_t
    contains
        function mysum_t(n, a) result(r)
            integer, intent(in) :: n
            type(t), intent(in) :: a(n)
            type(t) :: r
            integer :: i
            r = zero_t(a(1))
            do i = 1, size(a)
                r = plus_t(r, a(i))
            end do
        end function
    end template

contains

    subroutine test_template()
        instantiate array_tmpl(integer, add_integer, zero_integer), only: mysum_integer => mysum_t
        integer :: a(10), i, s
        do i = 1, size(a)
            a(i) = i
        end do
        s = mysum_integer(size(a), a)
        print *, s
    end subroutine

end module

program template_array_02b

    use template_array_02b_m
    implicit none

    call test_template()

end`,
    template_array_03: `module math

    implicit none
    private
    public :: add_integer, zero_integer, add_real, zero_real, mult_integer, mult_real

contains

    pure function add_integer(x, y) result(r)
        integer, intent(in) :: x, y
        integer :: r
        r = x + y
    end function

    pure function zero_integer(x) result(r)
        integer, intent(in) :: x
        integer :: r
        r = 0
    end function

    pure function mult_integer(x, y) result(r)
        integer, intent(in) :: x, y
        integer :: r
        r = x * y
    end function

    pure function add_real(x, y) result(r)
        real, intent(in) :: x, y
        real :: r
        r = x + y
    end function

    pure function zero_real(x) result(r)
        real, intent(in) :: x
        real :: r
        r = 0
    end function

    pure function mult_real(x, y) result(r)
        real, intent(in) :: x, y
        real :: r
        r = x * y
    end function

end module

module template_array_03_m

    use math
    implicit none
    private
    public :: test_template

    requirement operations(t, plus_t, zero_t, mult_t)

        type :: t; end type

        pure function plus_t(l, r) result(result)
            type(t), intent(in) :: l, r
            type(t) :: result
        end function

        pure function zero_t(x) result(result)
            type(t), intent(in) :: x
            type(t) :: result
        end function

        pure function mult_t(l, r) result(result)
            type(t), intent(in) :: l, r
            type(t) :: result
        end function

    end requirement
!
    template array_tmpl(t, plus_t, zero_t, mult_t)

        requires operations(t, plus_t, zero_t, mult_t)
        private
        public :: mymatmul_t

    contains

        subroutine mymatmul_t(i, j, k, a, b, r)
            integer, parameter, intent(in) :: i, j, k
            type(t), intent(in) :: a(i,j), b(j,k)
            type(t) :: r(i,k)
            integer, parameter :: x, y, z
            type(t) :: elem
            do x = 1, i
                do z = 1, k
                    elem = zero_t(a(1,1))
                    do y = 1, j
                        elem = plus_t(elem, mult_t(a(x,y), b(y,z)))
                    end do
                    r(x,z) = elem
                end do
            end do
        end subroutine

    end template

contains

    subroutine test_template()
        integer :: arr(2,2)
        integer :: r(2,2)
        arr(1,1) = 1
        arr(1,2) = 1
        arr(2,1) = 0
        arr(2,2) = 1
        instantiate array_tmpl(integer, add_integer, zero_integer, mult_integer), &
            only: mymatmul_int => mymatmul_t
        call mymatmul_int(2, 2, 2, arr, arr, r)
        print *, r(1,1)
        print *, r(1,2)
        print *, r(2,1)
        print *, r(2,2)
    end subroutine

end module

program template_array_03

    use template_array_03_m
    implicit none

    call test_template()

end`,
    template_array_04: `module reverse_m
    implicit none
    private
    public :: reverse_tmpl

    requirement default_behavior(t)
        type :: t; end type
    end requirement

    template reverse_tmpl(t)
        requires default_behavior(t)
        private
        public :: reverse
    contains
        subroutine swap(x, y)
            type(t), intent(inout) :: x, y
            type(t) :: tmp
            tmp = x
            x = y
            y = tmp
        end subroutine

        subroutine reverse(arr)
            type(t), intent(inout) :: arr(:)
            integer :: i, j
            do i = 1, size(arr)/2
                j = size(arr)+1-i
                call swap(arr(i), arr(j))
            end do
        end subroutine
    end template

contains

    subroutine test_reverse()
        instantiate reverse_tmpl(integer), &
            only: ireverse => reverse
        integer :: a(5)
        a = [1,2,3,4,5]
        call ireverse(a)
        print *, a
    end subroutine

end module

program main
use reverse_m
call test_reverse()
end program`
    }
}

export default preinstalled_programs;
