#include <Bridge.h>

#include "Ultrasonic.h"
Ultrasonic ultrasonic(4,5); //Ultrasonic ultrasonic(Trig,Echo);

#include "ADXL335.h"
ADXL335 accelerometer;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  accelerometer.begin();
  Bridge.begin();

}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.print(ultrasonic.Ranging(CM)); 
  Serial.print("cm");
  Serial.print("    ");
  Serial.print(ultrasonic.Ranging(INC)); 
  Serial.println("in");

  // MCU To MPU
  Bridge.put("Water_Height", String(ultrasonic.Ranging(CM)));

  int x,y,z;
  accelerometer.getXYZ(&x,&y,&z);
  Serial.println("value of X/Y/Z: ");
  Serial.println(x);
  Serial.println(y);
  Serial.println(z);
  float ax,ay,az;
  accelerometer.getAcceleration(&ax,&ay,&az);
  Serial.println("accleration of X/Y/Z: ");
  Serial.print(ax);
  Serial.println(" g");
  Serial.print(ay);
  Serial.println(" g");
  Serial.print(az);
  Serial.println(" g");

 // MCU To MPU
  Bridge.put("X-axis", String(ax));
  Bridge.put("Y-axis", String(ay));
  Bridge.put("Z-axis", String(az));
  
    
  delay(100);

}
