var src_code_mandel_brot = `program mandelbrot
integer, parameter :: Nx = 600, Ny = 450, n_max = 255, dp=8
real(dp), parameter :: xcenter = -0.5_dp, ycenter = 0.0_dp, &
    width = 4, height = 3, dx_di = width/Nx, dy_dj = -height/Ny, &
    x_offset = xcenter - (Nx+1)*dx_di/2, y_offset = ycenter - (Ny+1)*dy_dj/2
integer :: image(Ny,Nx), image_color(Ny,Nx,4), palette(4,3), i, j, n, idx
real(dp) :: x, y, x_0, y_0, x_sqr, y_sqr
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
do j = 1, Ny
    y_0 = y_offset + dy_dj * j
    do i = 1, Nx
        x_0 = x_offset + dx_di * i
        x = 0; y = 0; n = 0
        do
            x_sqr = x ** 2; y_sqr = y ** 2
            if (x_sqr + y_sqr > 4 .or. n == n_max) then
                image(j,i) = 255-n
                exit
            end if
            y = y_0 + 2 * x * y
            x = x_0 + x_sqr - y_sqr
            n = n + 1
        end do
    end do
end do
palette(1,1) =   0; palette(1,2) = 135; palette(1,3) =  68
palette(2,1) =   0; palette(2,2) =  87; palette(2,3) = 231
palette(3,1) = 214; palette(3,2) =  45; palette(3,3) =  32
palette(4,1) = 255; palette(4,2) = 167; palette(4,3) =   0
do j = 1, Ny
    do i = 1, Nx
        idx = image(j,i) - (image(j,i)/4)*4 + 1
        image_color(j,i,1) = palette(idx,1) ! Red
        image_color(j,i,2) = palette(idx,2) ! Green
        image_color(j,i,3) = palette(idx,3) ! Blue
        image_color(j,i,4) = 255            ! Alpha
    end do
end do
print *, "The Mandelbrot image in color:"
call show_img_color(Ny, Nx, image_color)
print *, "The Mandelbrot image in grayscale:"
call show_img(Ny, Nx, image)
print *, "Done."
end program mandelbrot
`;


var src_code_examples = {
    src_code_mandel_brot: src_code_mandel_brot
};

export default src_code_examples;
