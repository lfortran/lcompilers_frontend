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

end program template_nested`
    }
}

export default preinstalled_programs;
