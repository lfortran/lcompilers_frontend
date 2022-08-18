var src_code_mandel_brot = `program mandelbrot
    implicit none
    integer  , parameter :: rk       = 8
    integer  , parameter :: i_max    =  600
    integer  , parameter :: j_max    =  450
    integer  , parameter :: n_max    =  100
    real (rk), parameter :: x_centre = -0.5_rk
    real (rk), parameter :: y_centre =  0.0_rk
    real (rk), parameter :: width    =  4.0_rk
    real (rk), parameter :: height   =  3.0_rk
    real (rk), parameter :: dx_di    =   width / i_max
    real (rk), parameter :: dy_dj    = -height / j_max
    real (rk), parameter :: x_offset = x_centre - 0.5_rk * (i_max + 1) * dx_di
    real (rk), parameter :: y_offset = y_centre - 0.5_rk * (j_max + 1) * dy_dj
    integer :: image(j_max, i_max, 4)
    integer   :: i
    integer   :: j
    integer   :: n
    real (rk) :: x
    real (rk) :: y
    real (rk) :: x_0
    real (rk) :: y_0
    real (rk) :: x_sqr
    real (rk) :: y_sqr
    interface
        subroutine show_img_color(n, m, A) bind(c)
        integer, intent(in) :: n, m
        integer, intent(in) :: A(n,m,4)
        end subroutine
    end interface
    do j = 1, j_max
        y_0 = y_offset + dy_dj * j
        do i = 1, i_max
            x_0 = x_offset + dx_di * i
            x = 0.0_rk
            y = 0.0_rk
            n = 0
            do
            x_sqr = x ** 2
            y_sqr = y ** 2
            if (x_sqr + y_sqr > 4.0_rk) then
                image(j,i,1) = 255
                image(j,i,2) = 0
                image(j,i,3) = 0
                image(j,i,4) = 255
                exit
            end if
            if (n == n_max) then
                image(j,i,1) = 0
                image(j,i,2) = 0
                image(j,i,3) = 255
                image(j,i,4) = 255
                exit
            end if
            y = y_0 + 2.0_rk * x * y
            x = x_0 + x_sqr - y_sqr
            n = n + 1
            end do
        end do
    end do
    print *, "The Mandelbrot image is:"
    call show_img_color(j_max, i_max, image)
    print *, "Thank you! Hope you had fun!"
end program mandelbrot
`;


var src_code_examples = {
    src_code_mandel_brot: src_code_mandel_brot
};

export default src_code_examples;
