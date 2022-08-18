var src_code_mandel_brot = `program mandelbrot
    implicit none
    integer  , parameter :: rk       = 8
    integer  , parameter :: i_max    =  600
    integer  , parameter :: j_max    =  450
    integer  , parameter :: n_max    =  255
    real (rk), parameter :: x_centre = -0.5_rk
    real (rk), parameter :: y_centre =  0.0_rk
    real (rk), parameter :: width    =  4.0_rk
    real (rk), parameter :: height   =  3.0_rk
    real (rk), parameter :: dx_di    =   width / i_max
    real (rk), parameter :: dy_dj    = -height / j_max
    real (rk), parameter :: x_offset = x_centre - 0.5_rk * (i_max + 1) * dx_di
    real (rk), parameter :: y_offset = y_centre - 0.5_rk * (j_max + 1) * dy_dj
    integer :: image(j_max, i_max), image_color(j_max, i_max, 4), palette(4,3)
    integer   :: i, idx
    integer   :: j
    integer   :: n
    real (rk) :: x
    real (rk) :: y
    real (rk) :: x_0
    real (rk) :: y_0
    real (rk) :: x_sqr
    real (rk) :: y_sqr
    interface
        subroutine show_img(n, m, A) bind(c)
        integer, intent(in) :: n, m
        integer, intent(in) :: A(n,m)
        end subroutine

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
                if (x_sqr + y_sqr > 4.0_rk .or. n == n_max) then
                    image(j,i) = 255-n
                    exit
                end if
                y = y_0 + 2.0_rk * x * y
                x = x_0 + x_sqr - y_sqr
                n = n + 1
            end do
        end do
    end do
    palette(1,1) =   0; palette(1,2) = 135; palette(1,3) =  68
    palette(2,1) =   0; palette(2,2) =  87; palette(2,3) = 231
    palette(3,1) = 214; palette(3,2) =  45; palette(3,3) =  32
    palette(4,1) = 255; palette(4,2) = 167; palette(4,3) =   0

    do j = 1, j_max
        do i = 1, i_max
            idx = image(j,i) - (image(j,i)/4)*4 + 1
            image_color(j,i,1) = palette(idx,1) ! Red
            image_color(j,i,2) = palette(idx,2) ! Green
            image_color(j,i,3) = palette(idx,3) ! Blue
            image_color(j,i,4) = 255            ! Alpha
        end do
    end do
    print *, "The Mandelbrot image in color:"
    call show_img_color(j_max, i_max, image_color)
    print *, "The Mandelbrot image in grayscale:"
    call show_img(j_max, i_max, image)
    print *, "Done."
end program mandelbrot
`;


var src_code_examples = {
    src_code_mandel_brot: src_code_mandel_brot
};

export default src_code_examples;
