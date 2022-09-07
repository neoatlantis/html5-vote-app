import find_smallest_circle from "./smallest-circle-problem.js";



class CanvasGestureTracker {

    constructor(){
        this.points = []; 

        this.starttime = null;
        this.endtime = null;

        this.down = false;
    }

    register_down(x, y){
        this.starttime = new Date().getTime();
        this.points.push([
            x, y, this.starttime,
            { down: !this.down }
        ]);
    }

    register_move(x, y){
        this.points.push([x, y, new Date().getTime(), {}]);
        let dist = this._dist(
            this.points.slice(-1)[0],
            this.points.slice(-2)[0]
        );
        return {
            delta_x: dist[0],
            delta_y: dist[1],
            delta_t: dist[2],
        }
    }

    register_up(x, y){
        this.endtime = new Date().getTime();
        this.points.push([
            x, y, this.endtime,
            { down: !this.down }
        ]);
    }

    _dist(point1, point2){
        return [
            point2[0] - point1[0],
            point2[1] - point1[1],
            point2[2] - point1[2]
        ];
    }

    result(){
        let duration = 0;
        
        let disp = this._dist(this.points.slice(-1)[0], this.points[0]);

        return {
            current_down: this.down,
            duration: duration,
            distance: find_smallest_circle(this.points).r * 2,
            delta_x: disp[0],
            delta_y: disp[1],
            delta_t: disp[2],
        }
    }

}


export default CanvasGestureTracker;
