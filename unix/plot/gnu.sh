#!/usr/bin/gnuplot

set xlabel "test"
set ylabel "value"

set grid ytics lt 0 lw 1 lc rgb "#bbbbbb"
set grid xtics lt 0 lw 1 lc rgb "#bbbbbb"

set autoscale
set terminal postscript portrait enhanced mono dashed lw 1 'Helvetica' 14
set style line 1 lt 1 lw 3 pt 3 linecolor rgb "red"

set terminal png size 400,300 # enhanced font "Helvetica,20"
set output 'out.png'

plot "data.txt" u 1:2 smooth bezier title "YOLO"
# plot 'data.txt' using 2:1 w points title "tests"
