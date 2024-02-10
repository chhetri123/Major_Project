
import tensorflow as tf 
d_model = 512
class CustomSchedule(tf.keras.optimizers.schedules.LearningRateSchedule):
    def __init__(self, d_model, warmup_steps=4000):
        super(CustomSchedule, self).__init__()

        self.d_model = tf.cast(d_model, tf.float32)  # Ensure d_model is a float32
        self.warmup_steps = tf.cast(warmup_steps, tf.float32)  # Ensure warmup_steps is a float32

    def __call__(self, step):
        step = tf.cast(step, tf.float32)  # Ensure step is a float32

        arg1 = tf.math.rsqrt(step)
        arg2 = step * (self.warmup_steps ** -1.5)

        return tf.math.rsqrt(self.d_model) * tf.math.minimum(arg1, arg2)

learning_rate = CustomSchedule(d_model)